import { adminGenericProxyFetch, IDeskproClient } from "@deskpro/app-sdk";
import { ISettings } from "../types/settings";

export const getAccessAndRefreshTokens = async (
  settings: ISettings,
  accessCode: string,
  callbackUrl: string,
  client: IDeskproClient
) => {
  const fetch = await adminGenericProxyFetch(client);

  console.log("[Log] Getting tokens")
  // console.log("[Log] Settings: ", settings)
  return await fetch(`https://identity.xero.com/connect/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      authorization: `Basic ${btoa(
        `${settings?.client_id}:${settings?.client_secret}`
      )}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: accessCode ,
      redirect_uri:  callbackUrl,
    }),
  }).then((res) => res.json());
};

export const getTenants = async (
  client: IDeskproClient,
  access_token: string
) => {
  const fetch = await adminGenericProxyFetch(client);

  return await fetch(`https://api.xero.com/connections`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};