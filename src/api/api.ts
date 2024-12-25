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

export const getNotesByContactId = async (
  client: IDeskproClient,
  contactId: string
): Promise<IHistoryRecordList> => {
  const res = (await installedRequest(
    client,
    `api.xro/2.0/Contacts/${contactId}/history`,
    "GET"
  )) as IHistoryRecordList;

  res.HistoryRecords = res.HistoryRecords.filter(
    (record) => record.Changes === "Note"
  );

  return res;
};

export const getLineItemsById = (
  client: IDeskproClient,
  lineItemId: string
): Promise<IPurchaseOrderList> => {
  return installedRequest(client, `api.xro/2.0/Items/${lineItemId}`, "GET");
};

export const getPurchaseOrdersById = (
  client: IDeskproClient,
  purchaseOrderId: string
): Promise<IPurchaseOrderList> => {
  return installedRequest(
    client,
    `api.xro/2.0/PurchaseOrders/${purchaseOrderId}`,
    "GET"
  );
};

export const getPurchaseOrdersByContactId = async (
  client: IDeskproClient,
  contactId: string
): Promise<IPurchaseOrderList> => {
  const res = (await installedRequest(
    client,
    `api.xro/2.0/PurchaseOrders`,
    "GET"
  )) as IPurchaseOrderList;

  res.PurchaseOrders = res.PurchaseOrders.filter(
    (record) => record.Contact.ContactID === contactId
  );

  return res;
};

export const getQuotesById = (
  client: IDeskproClient,
  quoteId: string
): Promise<IQuoteList> => {
  return installedRequest(client, `api.xro/2.0/Quotes/${quoteId}`, "GET");
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

export const getBillsById = (
  client: IDeskproClient,
  billId: string
): Promise<IInvoiceList> => {
  return installedRequest(client, `api.xro/2.0/Invoices/${billId}`, "GET");
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

export const getInvoicesById = (
  client: IDeskproClient,
  invoiceId: string
): Promise<IInvoiceList> => {
  return installedRequest(client, `api.xro/2.0/Invoices/${invoiceId}`, "GET");
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

export const getContacts = (
  client: IDeskproClient,
  text?: string
): Promise<IContactList> => {
  if (!text)
    return new Promise((resolve) =>
      resolve({ Contacts: [] } as unknown as IContactList)
    );
  return installedRequest(
    client,
    `api.xro/2.0/Contacts${
      text &&
      `?where=${encodeURIComponent([
        `EmailAddress!=null&&EmailAddress.ToLower().Contains("${text.toLowerCase()}")`,
        `AccountNumber!=null&&AccountNumber.ToLower().Contains("${text.toLowerCase()}")`,
        `Name!=null&&Name.ToLower().Contains("${text.toLowerCase()}")`,
        `FirstName!=null&&FirstName.ToLower().Contains("${text.toLowerCase()}")`,
        `LastName!=null&&LastName.ToLower().Contains("${text.toLowerCase()}")`,
      ].join("||"))}`
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
