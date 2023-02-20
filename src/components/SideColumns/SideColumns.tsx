import styled from "styled-components";
import { Stack, H2, useDeskproAppTheme } from "@deskpro/app-sdk";

import { GreyTitle } from "../../styles";
import { ReactElement } from "react";

const Divider = styled.div`
  display: inline-block;
  width: 1px;
  height: 2.5em;
  background-color: ${({ theme }) => theme.colors.grey20};
  margin: 0px 6px 0px 0px;
`;

export const SideColumns = ({
  fields,
}: {
  fields: {
    key: string | number;
    value: string | number | ReactElement;
  }[];
}) => {
  const { theme } = useDeskproAppTheme();

  return (
    <Stack
      style={{
        display: "flex",
        width: "100%",
      }}
    >
      {fields.map((item, i) => (
        <Stack
          key={i}
          style={{
            position: i === 0 ? "relative" : "absolute",
            width: "100%",
            left: `${i * (100 / fields.length)}%`,
          }}
        >
          {i !== 0 && <Divider />}
          <Stack
            vertical
            gap={["string", "number"].includes(typeof item.value) ? 4 : 0}
          >
            <GreyTitle theme={theme}>{item.key}</GreyTitle>
            <H2>
              {item.value == null || item.value == "" ? "　" : item.value}
            </H2>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
