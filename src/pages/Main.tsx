import {
  Spinner,
  Stack,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBillsByContactId,
  getContactById,
  getInvoicesByContactId,
  getNotesByContactId,
  getPurchaseOrdersByContactId,
  getQuotesByContactId,
} from "../api/api";
import { IHistoryRecord, IInvoice, IPurchaseOrder, IQuote } from "../api/types";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import { useLinkContact } from "../hooks/hooks";
import { useQueryWithClient } from "../hooks/useQueryWithClient";
import billJson from "../mapping/bill.json";
import contactJson from "../mapping/contact.json";
import invoiceJson from "../mapping/invoice.json";
import noteJson from "../mapping/note.json";
import purchaseOrderJson from "../mapping/purchaseOrder.json";
import quoteJson from "../mapping/quote.json";
import { StyledLink } from "../styles";
import { QueryKeys } from "../utils/query";

export const Main = () => {
  const navigate = useNavigate();
  const [contactId, setContactId] = useState<string | null>(null);
  const { unlinkContact, context, client, getContactId } = useLinkContact();

  const contactQuery = useQueryWithClient(
    QueryKeys.CONTACT_BY_ID,
    (client) => getContactById(client, contactId as string),
    {
      enabled: !!contactId,
      onError: async () => {
        await unlinkContact();

        navigate("/findCreate/account");
      },
    }
  );

  const notesQuery = useQueryWithClient(
    QueryKeys.NOTES_BY_CONTACT_ID,
    (client) => getNotesByContactId(client, contactId as string),
    { enabled: !!contactId }
  );

  const purchaseOrderQuery = useQueryWithClient(
    QueryKeys.PURCHASE_ORDERS_BY_CONTACT_ID,
    (client) => getPurchaseOrdersByContactId(client, contactId as string),
    { enabled: !!contactId }
  );

  const invoiceQuery = useQueryWithClient(
    QueryKeys.INVOICE_BY_CONTACT_ID,
    (client) => getInvoicesByContactId(client, contactId as string),
    { enabled: !!contactId }
  );

  const billsQuery = useQueryWithClient(
    QueryKeys.BILLS_BY_CONTACT_ID,
    (client) => getBillsByContactId(client, contactId as string),
    { enabled: !!contactId }
  );

  const quotesQuery = useQueryWithClient(
    QueryKeys.QUOTES_BY_CONTACT_ID,
    (client) => getQuotesByContactId(client, contactId as string),
    { enabled: !!contactId }
  );

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Xero");

    client.deregisterElement("xeroLink");

    client.registerElement("refreshButton", { type: "refresh_button" });

    client.registerElement("xeroHomeButton", {
      type: "home_button",
    });

    client.registerElement("xeroMenuButton", {
      type: "menu",
      items: [
        {
          title: "Unlink contact",
          payload: {
            type: "changePage",
            page: "/",
          },
        },
      ],
    });
  });

  useEffect(() => {
    if (!context || !client) return;

    (async () => {
      const getLinkedContactId = await getContactId();

      if (!getLinkedContactId) {
        navigate("/findCreate/account");

        return;
      }

      setContactId(getLinkedContactId as string);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, client]);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "xeroMenuButton":
          await unlinkContact();

          navigate("/findCreate/account");

          return;
        case "xeroHomeButton":
          navigate("/redirect");
      }
    },
  });

  if (!contactQuery.data) {
    <Stack style={{ margin: "auto", marginTop: "20px" }}>
      <Spinner size="extra-large" />
    </Stack>;
  }

  const contact = contactQuery.data?.Contacts[0];
  const bills = billsQuery.data?.Invoices;
  const invoices = invoiceQuery.data?.Invoices;
  const quotes = quotesQuery.data?.Quotes;
  const purchaseOrders = purchaseOrderQuery.data?.PurchaseOrders;
  const notes = notesQuery.data?.HistoryRecords;

  return (
    <Stack vertical>
      {contact && (
        <Stack style={{ width: "100%" }}>
          <FieldMapping
            fields={[contact]}
            metadata={contactJson.main}
            idKey="ContactID"
            internalUrl={`/view/contact/`}
            externalUrl={contactJson.externalUrl}
            titleKeyName="Name"
          />
        </Stack>
      )}
      {invoices && invoices?.length !== 0 && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <StyledLink
            to={`/list/invoice/${contactId}`}
            style={{ fontSize: "14px" }}
          >
            Invoices ({invoices?.length})
          </StyledLink>
          <FieldMapping
            fields={invoices as IInvoice[]}
            internalUrl={`/view/invoice/`}
            metadata={invoiceJson.main}
            externalUrl={invoiceJson.externalUrl}
            idKey="InvoiceID"
            titleKeyName="InvoiceNumber"
          />
        </Stack>
      )}
      {bills && bills?.length !== 0 && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <StyledLink
            to={`/list/bill/${contactId}`}
            style={{ fontSize: "14px" }}
          >
            Bills ({bills?.length})
          </StyledLink>
          <FieldMapping
            fields={bills as IInvoice[]}
            metadata={billJson.main}
            internalUrl={`/view/bill/`}
            externalUrl={billJson.externalUrl}
            idKey="InvoiceID"
            titleKeyName="InvoiceNumber"
          />
        </Stack>
      )}
      {quotes && quotes?.length !== 0 && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <StyledLink
            to={`/list/quote/${contactId}`}
            style={{ fontSize: "14px" }}
          >
            Quotes ({quotes?.length})
          </StyledLink>
          <FieldMapping
            fields={quotes as IQuote[]}
            metadata={quoteJson.main}
            internalUrl={`/view/quote/`}
            externalUrl={quoteJson.externalUrl}
            titleKeyName="Title"
            idKey="QuoteID"
          />
        </Stack>
      )}
      {purchaseOrders && purchaseOrders?.length !== 0 && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <StyledLink
            style={{ fontSize: "14px" }}
            to={`/list/purchaseorder/${contactId}`}
          >
            Purchase Orders ({purchaseOrders?.length})
          </StyledLink>
          <FieldMapping
            fields={purchaseOrders as IPurchaseOrder[]}
            metadata={purchaseOrderJson.main}
            internalUrl={`/view/purchaseorder/`}
            externalUrl={purchaseOrderJson.externalUrl}
            titleKeyName="PurchaseOrderNumber"
            idKey="PurchaseOrderID"
          />
        </Stack>
      )}
      {notes && notes?.length !== 0 && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <StyledLink
            to={`/list/note/${contactId}`}
            style={{ fontSize: "14px" }}
          >
            Notes ({notes?.length})
          </StyledLink>
          <FieldMapping
            fields={notes as IHistoryRecord[]}
            metadata={noteJson.main}
          />
        </Stack>
      )}
    </Stack>
  );
};
