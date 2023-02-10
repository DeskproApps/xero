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
          {metadata?.map((metadataFields) => {
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
                  ).toLocaleDateString();

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

                default:
                  value = field[metadataField.name];
              }

              return {
                key: metadataField.label,
                value: value || "⠀",
              };
            });

            return usableFields.length === 1 ? (
              <Stack vertical gap={4}>
                <GreyTitle theme={theme}>{usableFields[0].key}</GreyTitle>
                <H2>{usableFields[0].value}</H2>
              </Stack>
            ) : (
              <TwoColumn
                leftLabel={usableFields[0].key}
                leftText={usableFields[0].value}
                rightLabel={usableFields[1].key}
                rightText={usableFields[1].value}
              />
            );
          })}
          <HorizontalDivider />
        </Stack>
      ))}
    </Stack>
  );
};
