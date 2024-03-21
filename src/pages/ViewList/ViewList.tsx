import { Spinner, Stack } from "@deskpro/deskpro-ui";
import {
  IDeskproClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getBillsByContactId,
  getBillsById,
  getContactById,
  getInvoicesByContactId,
  getInvoicesById,
  getNotesByContactId,
  getPurchaseOrdersByContactId,
  getPurchaseOrdersById,
  getQuotesByContactId,
  getQuotesById,
} from "../../api/api";
import { FieldMapping } from "../../components/FieldMapping/FieldMapping";
import { useQueryMutationWithClient } from "../../hooks/useQueryWithClient";
import contactJson from "../../mapping/contact.json";
import billJson from "../../mapping/bill.json";
import invoiceJson from "../../mapping/invoice.json";
import noteJson from "../../mapping/note.json";
import purchaseOrderJson from "../../mapping/purchaseOrder.json";
import quoteJson from "../../mapping/quote.json";

import { capitalizeFirstLetter, getFnKey } from "../../utils/utils";
import { IJson } from "../../types/json";

export const ViewList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { objectName, objectId } = useParams();
  const pageType = location.pathname.split("/")[1] as "view" | "list";

  const [correctJson, setCorrectJson] = useState<IJson | null>(null);

  const itemMutation = useQueryMutationWithClient<
    {
      function: (client: IDeskproClient, ContactID: string) => Promise<unknown>;
      ContactID: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >((client, data) => data?.function(client, data.ContactID));

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("refreshButton");
    client.deregisterElement("xeroHomeButton");
    client.deregisterElement("xeroLink");
    client.deregisterElement("xeroMenuButton");

    client.registerElement("refreshButton", { type: "refresh_button" });
    client.registerElement("xeroHomeButton", { type: "home_button" });

    if (!contactJson || !itemMutation.isSuccess) return;

    if (pageType === "list") {
      client.setTitle(
        `${correctJson?.title}s ${capitalizeFirstLetter(pageType)}`
      );

      return;
    }

    client.registerElement("xeroLink", {
      type: "cta_external_link",
      url: `https://go.xero.com/${correctJson?.externalUrl}${objectId}`,
      hasIcon: true,
    });

    client.setTitle(
      itemMutation.data[getFnKey(objectName as string)][0][
        correctJson?.titleKeyName as string
      ] || capitalizeFirstLetter(objectName || "")
    );
  }, [contactJson, itemMutation.isSuccess, pageType]);

  useEffect(() => {
    switch (objectName) {
      case "contact": {
        itemMutation.mutate({
          ContactID: objectId,
          function: getContactById,
        });

        setCorrectJson(contactJson);

        break;
      }
      case "invoice": {
        itemMutation.mutate({
          ContactID: objectId,
          function:
            pageType === "view" ? getInvoicesById : getInvoicesByContactId,
        });

        setCorrectJson(invoiceJson);

        break;
      }
      case "bill": {
        itemMutation.mutate({
          ContactID: objectId,
          function: pageType === "view" ? getBillsById : getBillsByContactId,
        });

        setCorrectJson(billJson);

        break;
      }
      case "purchaseorder": {
        itemMutation.mutate({
          ContactID: objectId,
          function:
            pageType === "view"
              ? getPurchaseOrdersById
              : getPurchaseOrdersByContactId,
        });

        setCorrectJson(purchaseOrderJson);

        break;
      }
      case "quote": {
        itemMutation.mutate({
          ContactID: objectId,
          function: pageType === "view" ? getQuotesById : getQuotesByContactId,
        });

        setCorrectJson(quoteJson);

        break;
      }
      case "note": {
        itemMutation.mutate({
          ContactID: objectId,
          function: getNotesByContactId,
        });

        setCorrectJson(noteJson);

        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectName, objectId]);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "xeroHomeButton":
          navigate("/redirect");
      }
    },
  });

  if (!itemMutation.data || !correctJson) {
    return (
      <Stack style={{ margin: "auto", marginTop: "20px" }}>
        <Spinner size="extra-large" />
      </Stack>
    );
  }

  return (
    <FieldMapping
      fields={itemMutation.data[getFnKey(objectName as string)]}
      metadata={
        correctJson[pageType] as {
          name: string;
          label: string;
          type: string;
        }[][]
      }
      titleKeyName={correctJson.titleKeyName}
      internalUrl={
        pageType === "list" && objectName !== "note"
          ? `/view/${objectName}/`
          : ""
      }
      idKey={correctJson.idKey}
    />
  );
};
