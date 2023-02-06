/* eslint-disable @typescript-eslint/no-explicit-any */
import contactJson from "../../mapping/contact.json";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodObject, ZodTypeAny } from "zod";
import { useEffect, useState } from "react";
import {
  Button,
  H0,
  H2,
  Stack,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { postContact } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { getMetadataBasedSchema } from "../../schemas/default";
import { FieldMappingInput } from "../FieldMappingInput/FieldMappingInput";
import { IContact } from "../../types/contact";
import { useLinkContact } from "../../hooks/hooks";
import { useQueryMutationWithClient } from "../../hooks/useQueryWithClient";

export const CreateAccount = () => {
  const { linkContact } = useLinkContact();
  const [schema, setSchema] = useState<ZodTypeAny>(z.object({}));

  const navigate = useNavigate();

  const submitMutation = useQueryMutationWithClient((data, client) =>
    postContact(client, data)
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<IContact>({
    resolver: zodResolver(schema as ZodObject<any>),
  });

  useEffect(() => {
    if (!submitMutation.isSuccess) return;

    linkContact((submitMutation.data as { id: string }).id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitMutation.isSuccess]);

  useEffect(() => {
    const newObj: { [key: string]: ZodTypeAny } = {};
    contactJson.create.forEach((field: any) => {
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
    setSchema(getMetadataBasedSchema(contactJson.create, newObj));
  }, []);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Create Contact");
  }, []);

  return (
    <form
      onSubmit={handleSubmit((data) => submitMutation.mutate(data))}
      style={{ width: "100%" }}
    >
      <Stack vertical gap={12}>
        <Stack vertical gap={12} style={{ width: "100%" }}>
          {contactJson.create.map((field, i) => {
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
            data-testid="submit-button"
            type="submit"
            text={submitMutation.isLoading ? "Submitting..." : "Submit"}
          ></Button>
          <Button
            disabled={submitMutation.isLoading}
            text="Cancel"
            onClick={() => navigate(-1)}
            intent="secondary"
          ></Button>
        </Stack>
        {submitMutation.isError && (
          <H2 style={{ color: "red", whiteSpace: "pre-line" }}>
            {(submitMutation.error as { message: string })?.message}
          </H2>
        )}
      </Stack>
    </form>
  );
};
