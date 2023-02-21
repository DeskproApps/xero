import styled from "styled-components";
import { Stack, useDeskproAppTheme, P8, P5 } from "@deskpro/app-sdk";

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
            <P8 style={{ color: theme?.colors.grey80 }}>{item.key}</P8>
            <P5>
              {item.value == null || item.value == "" ? "　" : item.value}
            </P5>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
