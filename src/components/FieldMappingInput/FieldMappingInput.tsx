/* eslint-disable @typescript-eslint/no-explicit-any */
import { H1, Stack, TextArea } from "@deskpro/deskpro-ui";
import { DateInput, useDeskproAppTheme } from "@deskpro/app-sdk";
import { FieldErrorsImpl } from "react-hook-form";
import { InputWithTitle } from "../InputWithTitle/InputWithTitle";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form/dist/types";
import { forwardRef } from "react";

type Props = {
  errors: Partial<FieldErrorsImpl<any>>;
  field: {
    name: string;
    label: string;
    type: string;
    required?: boolean;
  };
  required?: boolean;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  usersEnabled?: boolean;
};

export const FieldMappingInput = forwardRef(
  ({ field, errors, watch, setValue, register, ...attributes }: Props, ref) => {
    const { theme } = useDeskproAppTheme();

    const value = watch(field.name);

    if (field.label === "Type") return null;
    switch (field.type) {
      case "text":
      case "number":
      case "email":
        return (
          <InputWithTitle
            register={register(field.name, {
              setValueAs: (value) => {
                if (value === "") return undefined;
                if (field.type === "number") return Number(value);

                return value;
              },
            })}
            title={field.label}
            error={!!errors[field.name]}
            type={field.type}
            required={field.required}
            {...attributes}
          ></InputWithTitle>
        );
      case "textarea":
        return (
          <Stack
            vertical
            gap={4}
            style={{ width: "100%", color: theme.colors.grey80 }}
          >
            <H1>{field.label}</H1>
            <TextArea
              variant="inline"
              value={watch(field.name)}
              error={!!errors[field.name]}
              onChange={(e) => setValue(field.name, e.target.value)}
              placeholder="Enter text here..."
              required={field.required}
              title={field.label}
              {...attributes}
              style={{
                resize: "none",
                minHeight: "5em",
                maxHeight: "100%",
                height: "auto",
                width: "100%",
                overflow: "hidden",
              }}
            />
          </Stack>
        );
      case "date":
        return (
          <DateInput
            required={field.required}
            style={
              !!errors?.[field.name] && {
                borderBottomColor: "red",
              }
            }
            ref={ref}
            value={value ? new Date(value) : null}
            label={field.label}
            error={!!errors?.[field.name]}
            {...attributes}
            onChange={(e: [Date]) => setValue(field.name, e[0].toISOString())}
          />
        );
    }
    return null;
  }
);
