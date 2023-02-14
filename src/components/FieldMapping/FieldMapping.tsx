import { H2, P2, Stack, useDeskproAppTheme } from "@deskpro/app-sdk";
import { GreyTitle, StyledLink } from "../../styles";
import { CustomTag } from "../CustomTag/CustomTag";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { LogoAndLinkButton } from "../LogoAndLinkButton/LogoAndLinkButton";
import { TwoColumn } from "../TwoColumns/TwoColumns";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[];
  internalUrl?: string;
  externalUrl?: string;
  metadata: {
    name: string;
    label: string;
    type: string;
  }[][];
  titleKeyName: string;
  idKey: string;
};

export const FieldMapping = ({
  fields,
  internalUrl,
  externalUrl,
  metadata,
  titleKeyName,
  idKey,
}: Props) => {
  const { theme } = useDeskproAppTheme();

  return (
    <Stack vertical gap={4} style={{ width: "100%" }}>
      {fields.map((field, i) => (
        <Stack vertical style={{ width: "100%" }} gap={7} key={i}>
          <Stack style={{ justifyContent: "space-between", width: "100%" }}>
            {internalUrl ? (
              <StyledLink to={internalUrl}>
                {field[titleKeyName] || i}
              </StyledLink>
            ) : (
              <P2 style={{ fontSize: "14px" }}>{field[titleKeyName] || i}</P2>
            )}
            {externalUrl && (
              <LogoAndLinkButton
                endpoint={externalUrl + field[idKey]}
              ></LogoAndLinkButton>
            )}
          </Stack>
          {metadata?.map((metadataFields, i) => {
            const usableFields = metadataFields.map((metadataField) => {
              let value;
              switch (metadataField.type) {
                case "date":
                  value = new Date(
                    Number(
                      field[metadataField.name]?.match(
                        /\/Date\((?<date>.+?)(\+|\))/
                      ).groups.date
                    )
                  ).toLocaleDateString("en-UK");

                  break;
                case "label": {
                  value = (
                    <CustomTag title={field[metadataField.name]}></CustomTag>
                  );

                  break;
                }

                case "currency": {
                  value = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: field.CurrencyCode,
                  }).format(field[metadataField.name]);

                  break;
                }

                case "url": {
                  value = field[metadataField.name] ? (
                    <StyledLink to={field[metadataField.name]}>
                      {field[metadataField.name]}
                    </StyledLink>
                  ) : (
                    ""
                  );

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
                    (e: { PhoneType: string }) =>
                      e.PhoneType === metadataField.name
                  );

                  value = phoneFields?.PhoneNumber
                    ? `+${phoneFields?.PhoneCountryCode} ${phoneFields?.PhoneAreaCode} ${phoneFields?.PhoneNumber}`
                    : null;

                  break;
                }

                default:
                  value = field[metadataField.name];
              }

              return {
                key: metadataField.label,
                value: value,
              };
            });

            return usableFields.length === 1 ? (
              usableFields[0].value && (
                <Stack vertical gap={4} key={i}>
                  <GreyTitle theme={theme}>{usableFields[0].key}</GreyTitle>
                  <H2 style={{ whiteSpace: "pre-line" }}>
                    {usableFields[0].value}
                  </H2>
                </Stack>
              )
            ) : (
              <TwoColumn
                key={i}
                leftLabel={usableFields[0].key}
                leftText={usableFields[0].value || "⠀"}
                rightLabel={usableFields[1].key}
                rightText={usableFields[1].value || "⠀"}
              />
            );
          })}
          <HorizontalDivider />
        </Stack>
      ))}
    </Stack>
  );
};
