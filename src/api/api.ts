import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { IContact } from "../types/contact";
import { RequestMethod } from "./types";

export const getContactById = (client: IDeskproClient, id: string) => {
  return installedRequest(client, `api.xro/2.0/Contacts/${id}`, "GET");
};

export const getContacts = (client: IDeskproClient, text?: string) => {
  return installedRequest(
    client,
    `api.xro/2.0/Contacts${
      text &&
      `?where=EmailAddress.Contains("${text}||Name.Contains("${text}||AccountNumber.Contains("${text}")`
    }`,
    "GET"
  );
};

export const postContact = (
  client: IDeskproClient,
  data: IContact
): Promise<unknown> => {
  return installedRequest(client, "api.xro/2.0/Contacts", "POST", data);
};

const installedRequest = async (
  client: IDeskproClient,
  url: string,
  method: RequestMethod,
  data?: unknown
) => {
  const fetch = await proxyFetch(client);

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer [[oauth/global/access_token]]`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response = await fetch(`https://api.xero.com/${url.trim()}`, options);

  if ([400, 401, 403].includes(response.status)) {
    const refreshRequestOptions: RequestInit = {
      method: "POST",
      body: `grant_type=refresh_token&refresh_token=__global_access_token.json("[refresh_token]")__`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic __client_id.base64encode__${btoa(
          ":"
        )}__client_secret.base64encode__`,
      },
    };

    const refreshRes = await fetch(
      `https://identity.xero.com/connect/token`,
      refreshRequestOptions
    );

    const refreshData = await refreshRes.json();

    await client.setState<string>(
      "oauth/global/access_token",
      refreshData.access_token,
      {
        backend: true,
      }
    );

    options.headers = {
      ...options.headers,
      Authorization: `Bearer [[oauth/global/access_token]]`,
    };

    response = await fetch(`https://api.xero.com/${url.trim()}`, options);
  }

  if (isResponseError(response)) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        message: await response.text(),
      })
    );
  }

  return response.json();
};

export const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;
