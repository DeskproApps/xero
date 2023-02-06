import {
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContactById } from "../api/api";
import { useLinkContact } from "../hooks/hooks";
import { useQueryMutationWithClient } from "../hooks/useQueryWithClient";

const MOCKDATA = {
  User: {
    PrimaryName: "John Doe",
    PrimaryEmail: "johndoe@email.com",
  },
  Invoices: [
    {
      InvoiceNumber: "INV-123",
      InvoiceDate: "2021-01-01",
      DueAmount: "£100.00",
      Status: "Paid",
      Reference: "12312394",
    },
    {
      InvoiceNumber: "INV-124",
      InvoiceDate: "2021-01-01",
      DueAmount: "£100.00",
      Status: "Authorized",
      Reference: "12312394",
    },
  ],
  Bills: [
    {
      BillNumber: "BILL-123",
      BillDate: "2021-01-01",
      DueAmount: "£100.00",
      Status: "Awaiting Payment",
      Reference: "12312394",
    },
    {
      BillNumber: "BILL-124",
      BillDate: "2021-01-01",
      DueAmount: "£100.00",
      Status: "Paid",
      Reference: "12312394",
    },
  ],
  Quotes: [
    {
      QuoteNumber: "QUOTE-123",
      Date: "2021-01-01",
      Total: "£100.00",
      Redefence: "2022-01-01",
    },
  ],
};

export const Main = () => {
  const [contactId, setContactId] = useState<string | null>(null);

  const contactMutation = useQueryMutationWithClient((id, client) =>
    getContactById(client, id)
  );

  const { unlinkContact, context, client, getContactId } = useLinkContact();
  contactId;
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

      if (!getLinkedContactId) navigate("/findCreate/account");

      setContactId(getLinkedContactId as string);

      contactMutation.mutate(getLinkedContactId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, client]);

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "refreshButton":
          unlinkContact();

          break;
      }
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    navigate("/findCreate/account");
  });

  return <div></div>;
};
