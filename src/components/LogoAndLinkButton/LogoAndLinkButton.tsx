import { XeroLogo } from "../XeroLogo/XeroLogo";
import { AnchorButton } from "@deskpro/deskpro-ui";

export const LogoAndLinkButton = ({ endpoint }: { endpoint: string }) => {
  return (
    <AnchorButton
    intent="secondary"
    target="_blank"
    style={{padding: "0px 8px", boxSizing: "border-box", borderRadius: "16px"}}
      href={`https://go.xero.com/${endpoint}`}
      icon={<XeroLogo />}
      rightIcon={"solid-dazzle-link-alt-1"}
    />
  );
};
