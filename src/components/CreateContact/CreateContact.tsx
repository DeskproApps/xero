/* eslint-disable @typescript-eslint/no-explicit-any */
import contactJson from "../../mapping/contact.json";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodObject, ZodTypeAny } from "zod";
import { useEffect, useState } from "react";
import { Button, H0, H2, Stack } from "@deskpro/deskpro-ui";
import { useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { postContact } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { getMetadataBasedSchema } from "../../schemas/default";
import { FieldMappingInput } from "../FieldMappingInput/FieldMappingInput";
import { IContact } from "../../types/contact";
import { useLinkContact } from "../../hooks";
import { useQueryMutationWithClient } from "../../hooks/useQueryWithClient";
import { IContactList } from "../../api/types";
import { UserData, ISettings } from "../../types/settings";
import styled from "styled-components";

const ErrorBlock = styled(Stack)`
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.red100};
`;

export const CreateAccount = () => {
  const { linkContact } = useLinkContact();
  const { context } = useDeskproLatestAppContext<UserData, ISettings>();
  const [schema, setSchema] = useState<ZodTypeAny>(z.object({}));

  const navigate = useNavigate();

  const submitMutation = useQueryMutationWithClient<IContact, IContactList>(
    (client, data) => postContact(client, data)
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<IContact>({
    resolver: zodResolver(schema as ZodObject<any>),
  });

  useEffect(() => {
    if (!context) return;

    reset({
      EmailAddress: context.data?.user?.primaryEmail,
      FirstName: context.data?.user?.firstName,
      LastName: context.data?.user?.lastName,
      Name: context.data?.user?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  useEffect(() => {
    if (!submitMutation.isSuccess) return;

    (async () => {
      await linkContact(submitMutation.data?.Contacts[0].ContactID);

      navigate("/");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitMutation.isSuccess]);

  useEffect(() => {
    const newObj: { [key: string]: ZodTypeAny } = {};
    contactJson.create.flat().forEach((field: any) => {
      if (field.type === "email") {
        newObj[field.name] = z.string().email().optional();
      }
      if (field.type === "text") {
        newObj[field.name] = z.string().optional();
      }
      if (field.type === "number") {
        newObj[field.name] = z.number().optional();
      }
    });
    setSchema(getMetadataBasedSchema(contactJson.create.flat(), newObj));
  }, []);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Create Contact");
  }, []);

  return (
    <form
      onSubmit={handleSubmit((data) => submitMutation.mutate(data))}
      style={{ width: "100%" }}
    >
      <Stack vertical gap={12} style={{marginTop: "15px"}}>
        <Stack vertical gap={12} style={{ width: "100%" }}>
          {contactJson.create.flat().map((field, i) => {
            return (
              <Stack vertical gap={8} style={{ width: "100%" }} key={i}>
                {field && field.name === "firstName" && <H0>Primary Person</H0>}
                <FieldMappingInput
                  field={field}
                  key={i}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  data-testid={`input-${field?.name}`}
                />
                {field && errors[field.name as keyof IContact] && (
                  <H2 style={{ color: "red" }}>
                    {errors[field.name as keyof IContact]?.message}
                  </H2>
                )}
              </Stack>
            );
          })}
        </Stack>
        <Stack
          style={{ justifyContent: "space-between", width: "100%" }}
          gap={5}
        >
          <Button
            loading={submitMutation.isLoading}
            disabled={submitMutation.isLoading}
            data-testid="button-submit"
            type="submit"
            text={submitMutation.isLoading ? "Submitting..." : "Submit"}
          ></Button>
          <Button
            disabled={submitMutation.isLoading}
            text="Cancel"
            onClick={() => navigate("/")}
            intent="secondary"
          ></Button>
        </Stack>
        {submitMutation.isError && (
          // This is a temporary fix so the user doesn't get a log of an error object that's confusing
          // It would be better to tell the user what went wrong (if its helpful)
          // the submitMutation.error.message is a JSON that need to parsed properlly
          // then it's content can be displayed to the user (if helpful).
          <ErrorBlock>
            An error occured while creating the contact.
          </ErrorBlock>
        )}
      </Stack>
    </form>
  );
};
