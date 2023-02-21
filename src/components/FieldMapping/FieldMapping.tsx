import { H1, H3, P11, P8, Stack, useDeskproAppTheme } from "@deskpro/app-sdk";
import { P5 } from "@deskpro/deskpro-ui";
import { StyledLink } from "../../styles";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { LogoAndLinkButton } from "../LogoAndLinkButton/LogoAndLinkButton";
import { SideColumns } from "../SideColumns/SideColumns";
import lineItemJson from "../../mapping/lineitem.json";
import { IJson } from "../../types/json";
import { ReactElement } from "react";
import { mapFieldValues } from "../../utils/mapFieldValues";

const SpaceBetweenFields = ({
  field: field,
}: {
  field: {
    key: string | number;
    value: string | number | ReactElement;
  };
}) => {
  return (
    <Stack
      style={{
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <H1>{field.key}:</H1>
      <H1>{field.value}</H1>
    </Stack>
  );
};

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[];
  internalUrl?: string;
  externalUrl?: string;
  metadata: IJson["list"] | IJson["view"];
  titleKeyName?: string;
  idKey?: string;
};

export const FieldMapping = ({
  fields,
  internalUrl,
  externalUrl,
  metadata,
  titleKeyName = "",
  idKey = "",
}: Props) => {
  const { theme } = useDeskproAppTheme();

  return (
    <Stack vertical gap={4} style={{ width: "100%" }}>
      {fields.map((field, i) => (
        <Stack vertical style={{ width: "100%" }} gap={5} key={i}>
          <Stack style={{ justifyContent: "space-between", width: "100%" }}>
            {internalUrl && (
              <StyledLink to={`${internalUrl}${field[idKey]}`}>
                {field[titleKeyName] || i}
              </StyledLink>
            )}
            {externalUrl && (
              <LogoAndLinkButton
                endpoint={externalUrl + field[idKey]}
              ></LogoAndLinkButton>
            )}
          </Stack>
          {metadata?.map((metadataFields, i) => {
            const usableFields = mapFieldValues(metadataFields, field);

            if (usableFields.some((e) => e.value === "lineitem")) {
              return (
                <FieldMapping
                  key={i}
                  fields={field.LineItems.filter(
                    (e: { UnitAmount: number }) => e.UnitAmount
                  ).map((e: { CurrencyCode: string }) => ({
                    ...e,
                    CurrencyCode: field.CurrencyCode,
                  }))}
                  metadata={lineItemJson.view}
                ></FieldMapping>
              );
            }

            switch (usableFields.length) {
              case 1:
                return (
                  usableFields[0].value && (
                    <Stack vertical gap={4} key={i}>
                      <P8 style={{ color: theme.colors.grey80 }}>
                        {usableFields[0].key}
                      </P8>
                      <P5 style={{ whiteSpace: "pre-line" }}>
                        {usableFields[0].value}
                      </P5>
                    </Stack>
                  )
                );
              case 4:
              case 2:
                return <SideColumns key={i} fields={usableFields} />;

              case 3:
                return (
                  <Stack
                    style={{ justifyContent: "space-between", width: "100%" }}
                    key={i}
                  >
                    <Stack vertical gap={4}>
                      <P5 theme={theme}>{usableFields[0].value}</P5>
                      <P11 style={{ whiteSpace: "pre-line" }}>
                        {usableFields[1].value}
                      </P11>
                    </Stack>
                    <H3>{usableFields[2].value}</H3>
                  </Stack>
                );

              default:
                return (
                  <Stack gap={20} vertical style={{ width: "100%" }} key={i}>
                    {usableFields
                      .filter((e) => e.key)
                      .map((usableField, usableFieldI) => (
                        <Stack
                          vertical
                          style={{ width: "100%" }}
                          key={usableFieldI}
                        >
                          <SpaceBetweenFields
                            field={usableField}
                          ></SpaceBetweenFields>
                        </Stack>
                      ))}
                  </Stack>
                );
            }
          })}
          <HorizontalDivider />
        </Stack>
      ))}
    </Stack>
  );
};
