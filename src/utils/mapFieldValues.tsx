import { ReactElement } from "react";
import { APIArrayReturnTypes, Contact } from "../api/types";
import { CustomTag } from "../components/CustomTag/CustomTag";
import { StyledLink } from "../styles";
import { IJson } from "../types/json";

export const mapFieldValues = (
  metadataFields: IJson["list"][0] | IJson["view"][0],
  field: APIArrayReturnTypes
): {
  key: string | number;
  value: string | number | ReactElement;
}[] => {
  return metadataFields.map((metadataField) => {
    let value;
    switch (metadataField.type) {
      case "date":
        value = new Date(
          Number(
            (
              field[metadataField.name as keyof APIArrayReturnTypes] as string
            )?.match(/\/Date\((?<date>.+?)(\+|\))/)?.groups?.date as string
          )
        ).toLocaleDateString("en-UK");

        break;
      case "label": {
        value = (
          <CustomTag
            title={
              field[metadataField.name as keyof APIArrayReturnTypes] as string
            }
          ></CustomTag>
        );

        break;
      }

      case "currency": {
        if (metadataField.name === "Paid")
          field.Paid = field.Total - field.AmountDue;

        value = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: field.CurrencyCode,
        }).format(
          field[metadataField.name as keyof APIArrayReturnTypes] as number
        );

        break;
      }

      case "url": {
        value = field[metadataField.name as keyof APIArrayReturnTypes] ? (
          <StyledLink
            to={
              field[metadataField.name as keyof APIArrayReturnTypes] as string
            }
          >
            {field[metadataField.name as keyof APIArrayReturnTypes] as string}
          </StyledLink>
        ) : (
          ""
        );

        break;
      }

      case "percentage": {
        value = `${field[metadataField.name as keyof APIArrayReturnTypes]}%`;

        break;
      }

      case "contact": {
        value = field.Contact[metadataField.name as keyof Contact];

        break;
      }

      case "lineitem": {
        value = "lineitem";

        break;
      }

      case "address": {
        value = (
          Object.values(
            field.Addresses?.find(
              (e: { AddressType: string }) =>
                e.AddressType === metadataField.name
            ) ?? {}
          ) as string[]
        )
          ?.filter((e) => e !== "POBOX")
          .reduce((acc, cur) => acc + cur + "\n", "");
        value = value.trim() === "" ? null : value;

        break;
      }

      case "phone": {
        const phoneFields = field.Phones?.find(
          (e: { PhoneType: string }) => e.PhoneType === metadataField.name
        );

        value = phoneFields?.PhoneNumber
          ? `+${phoneFields?.PhoneCountryCode} ${phoneFields?.PhoneAreaCode} ${phoneFields?.PhoneNumber}`
          : null;

        break;
      }

      default:
        value = field[metadataField.name as keyof APIArrayReturnTypes];
    }

    return {
      key: metadataField.label,
      value: value as string | number | ReactElement,
    };
  });
};
