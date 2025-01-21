import { ExternalIconLink } from "@deskpro/app-sdk";
import { XeroLogo } from "../../XeroLogo/XeroLogo";

const XeroLink = ({ endpoint }: { endpoint: string }) => (
  <ExternalIconLink
    href={`https://go.xero.com/${endpoint}`}
    icon={<XeroLogo />}
  />
);

export { XeroLink };
