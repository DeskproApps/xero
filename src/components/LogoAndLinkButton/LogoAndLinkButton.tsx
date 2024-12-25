import { ExternalIconLink } from "@deskpro/app-sdk";
import { XeroLogo } from "../XeroLogo/XeroLogo";

export const LogoAndLinkButton = ({ endpoint }: { endpoint: string }) => {
  return (
    <ExternalIconLink
      href={`https://go.xero.com/${endpoint}`}
      icon={<XeroLogo />}
    />
  );
};
