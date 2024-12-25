import styled from "styled-components";
import { TSpan } from "@deskpro/deskpro-ui";
import type { TProps } from "@deskpro/deskpro-ui";
import type { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<Omit<TProps, "type">> & {
  type?: TProps["type"],
};

const SecondaryStyled = styled(TSpan)`
  color: ${({ theme }) => theme.colors.grey60};
`;

const Secondary: FC<Props> = ({ type = "p1", ...props }) => (
  <SecondaryStyled type={type} {...props}/>
);

export { Secondary };
