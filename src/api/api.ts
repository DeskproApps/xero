import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { IContact } from "../types/contact";
import {
  IContactList,
  IHistoryRecordList,
  IInvoiceList,
  IPurchaseOrderList,
  IQuoteList,
  RequestMethod,
} from "./types";

export const getNotesByContactId = (
  client: IDeskproClient,
  contactId: string
): Promise<IHistoryRecordList> => {
  return installedRequest(
    client,
    `api.xro/2.0/Contacts/${contactId}/history`,
    "GET"
  );
};

export const getPurchaseOrdersByContactId = (
  client: IDeskproClient
): Promise<IPurchaseOrderList> => {
  return installedRequest(client, `api.xro/2.0/PurchaseOrders`, "GET");
};

export const getQuotesByContactId = (
  client: IDeskproClient,
  contactId: string
): Promise<IQuoteList> => {
  return installedRequest(
    client,
    `api.xro/2.0/Quotes?ContactID=${contactId}`,
    "GET"
  );
};

export const getBillsByContactId = (
  client: IDeskproClient,
  contactId: string
): Promise<IInvoiceList> => {
  return installedRequest(
    client,
    `api.xro/2.0/Invoices?ContactIDs=${contactId}&Where=Type=="ACCPAY"`,
    "GET"
  );
};

export const getInvoicesByContactId = (
  client: IDeskproClient,
  contactId: string
): Promise<IInvoiceList> => {
  return installedRequest(
    client,
    `api.xro/2.0/Invoices?ContactIDs=${contactId}&Where=Type!="ACCPAY"`,
    "GET"
  );
};

export const getContactById = (
  client: IDeskproClient,
  id: string
): Promise<IContactList> => {
  return installedRequest(client, `api.xro/2.0/Contacts?Ids=${id}`, "GET");
};

export const getContacts = (client: IDeskproClient, text?: string) => {
  return installedRequest(
    client,
    `api.xro/2.0/Contacts${
      text &&
      `?where=${encodeURIComponent(
        `EmailAddress!=null&&EmailAddress.Contains("${text}")||Name!=null&&Name.Contains("${text}")||AccountNumber!=null&&AccountNumber.Contains("${text}")`
      )}`
    }`,
    "GET"
  );
};

export const postContact = (
  client: IDeskproClient,
  data: IContact
): Promise<IContactList> => {
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
      "xero-tenant-id": `__global_access_token.json("[tenant_id]")__`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response = await fetch(`https://api.xero.com/${url.trim()}`, options);

  if ([400, 401, 403, 404].includes(response.status)) {
    let tokens;
    const refreshRequestOptions: RequestInit = {
      method: "POST",
      body: `grant_type=refresh_token&refresh_token=[[oauth/global/refresh_token]]`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic __client_id+':'+client_secret.base64__`,
      },
    };

    const refreshRes = await fetch(
      `https://identity.xero.com/connect/token`,
      refreshRequestOptions
    );

    if (refreshRes.status !== 200) {
      refreshRequestOptions.body = `grant_type=refresh_token&refresh_token=__global_access_token.json("[refresh_token]")__`;

      const secondRefreshRes = await fetch(
        `https://identity.xero.com/connect/token`,
        refreshRequestOptions
      );

      const secondRefreshData = await secondRefreshRes.json();

      if (secondRefreshRes.status !== 200) {
        throw new Error(
          JSON.stringify({
            status: secondRefreshRes.status,
            message: secondRefreshData,
          })
        );
      }

      tokens = secondRefreshData;
    } else {
      tokens = await refreshRes.json();
    }

    await client.setState<string>(
      "oauth/global/access_token",
      tokens.access_token,
      {
        backend: true,
      }
    );

    await client.setState<string>(
      "oauth/global/refresh_token",
      tokens.refresh_token,
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
