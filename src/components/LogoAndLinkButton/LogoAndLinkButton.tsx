import { Stack, useDeskproAppTheme } from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

import { XeroLogo } from "../XeroLogo/XeroLogo";
import { StyledLink } from "../../styles";

export const LogoAndLinkButton = ({ endpoint }: { endpoint: string }) => {
  const { theme } = useDeskproAppTheme();

  return (
    <StyledLink to={`https://go.xero.com/${endpoint}`} target="_blank">
      <Stack
        style={{
          backgroundColor: "#F3F5F7",
          borderRadius: "10px",
          padding: "2px 5px 2px 5px",
          marginLeft: "10px",
          cursor: "pointer",
        }}
      >
        <XeroLogo />
        <FontAwesomeIcon
          icon={faArrowUpRightFromSquare}
          style={{
            marginLeft: "10px",
            alignSelf: "center",
            width: "10px",
            color: theme?.colors?.brandShade100,
          }}
        ></FontAwesomeIcon>
      </Stack>
    </StyledLink>
  );
};
