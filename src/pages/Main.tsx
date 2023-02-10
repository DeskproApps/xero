import {
  P2,
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
import { QueryKeys } from "../utils/query";

export const Main = () => {
  const navigate = useNavigate();
  const [contactId, setContactId] = useState<string | null>(null);
  const { unlinkContact, context, client, getContactId } = useLinkContact();

  const contactQuery = useQueryWithClient(
    QueryKeys.CONTACT_BY_ID,
    (client) => getContactById(client, contactId as string),
    { enabled: !!contactId }
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
    client.registerElement("refreshButton", { type: "refresh_button" });

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
    onElementEvent(id) {
      switch (id) {
        case "xeroMenuButton":
          unlinkContact();

          navigate(-1);

          return;
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
  const notes = notesQuery.data?.HistoryRecords.filter(
    (e) => e.Changes === "Note"
  );

  return (
    <Stack vertical>
      {contactQuery.isSuccess && (
        <Stack style={{ width: "100%" }}>
          <FieldMapping
            fields={[contact]}
            metadata={contactJson.list}
            idKey="ContactID"
            externalUrl={`Contacts/View/`}
            titleKeyName="Name"
          />
        </Stack>
      )}
      {invoiceQuery.data && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <P2 style={{ fontSize: "14px" }}>Invoices ({invoices?.length})</P2>
          <FieldMapping
            fields={invoices as IInvoice[]}
            metadata={invoiceJson.list}
            externalUrl={`AccountsReceivable/View.aspx?invoiceid=`}
            idKey="InvoiceID"
            titleKeyName="InvoiceNumber"
          />
        </Stack>
      )}
      {billsQuery.data && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <P2 style={{ fontSize: "14px" }}>Bills ({bills?.length})</P2>
          <FieldMapping
            fields={bills as IInvoice[]}
            metadata={billJson.list}
            externalUrl={`AccountsPayable/View.aspx?invoiceid=`}
            idKey="InvoiceID"
            titleKeyName="InvoiceNumber"
          />
        </Stack>
      )}
      {quotesQuery.isSuccess && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <P2 style={{ fontSize: "14px" }}>Quotes ({quotes?.length})</P2>
          <FieldMapping
            fields={quotes as IQuote[]}
            metadata={quoteJson.list}
            externalUrl={`Accounts/Receivable/Quotes/Edit/`}
            titleKeyName="Title"
            idKey="QuoteID"
          />
        </Stack>
      )}
      {purchaseOrderQuery.isSuccess && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <P2 style={{ fontSize: "14px" }}>
            Purchase Orders ({purchaseOrders?.length})
          </P2>
          <FieldMapping
            fields={purchaseOrders as IPurchaseOrder[]}
            metadata={purchaseOrderJson.list}
            externalUrl={`Accounts/Payable/PurchaseOrders/View/`}
            titleKeyName="PurchaseOrderNumber"
            idKey="PurchaseOrderID"
          />
        </Stack>
      )}
      {notesQuery.isSuccess && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <P2 style={{ fontSize: "14px" }}>Notes ({notes?.length})</P2>
          <FieldMapping
            fields={notes as IHistoryRecord[]}
            metadata={noteJson.list}
            titleKeyName=""
            idKey=""
          />
        </Stack>
      )}
    </Stack>
  );
};
