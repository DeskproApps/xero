import {
  IDeskproClient,
  Spinner,
  Stack,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getContactById } from "../../api/api";
import { FieldMapping } from "../../components/FieldMapping/FieldMapping";
import { useQueryMutationWithClient } from "../../hooks/useQueryWithClient";
import contactJson from "../../mapping/contact.json";

export const ViewList = () => {
  const { object, contactId } = useParams();

  const correctJson = useMemo(() => {
    switch (object) {
      case "contact":
        return contactJson;
    }
  }, [object]);

  useInitialisedDeskproAppClient((client) => {
    client.registerElement("xeroLink", {
      type: "cta_external_link",
      url: `https://go.xero.com/${correctJson?.externalUrl}${contactId}`,
      hasIcon: true,
    });
  });

  const itemMutation = useQueryMutationWithClient<
    {
      function: (client: IDeskproClient, ContactID: string) => Promise<unknown>;
      ContactID: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >((client, data) => data?.function(client, data.ContactID));

  useEffect(() => {
    switch (object) {
      case "contact": {
        itemMutation.mutate({ ContactID: contactId, function: getContactById });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [object, contactId]);

  if (!itemMutation.data || !correctJson) {
    return (
      <Stack style={{ margin: "auto", marginTop: "20px" }}>
        <Spinner size="extra-large" />
      </Stack>
    );
  }

  return (
    <FieldMapping
      fields={[itemMutation.data.Contacts[0]]}
      metadata={correctJson.view}
      idKey={correctJson.idKey}
      titleKeyName={correctJson.titleKeyName}
    />
  );
};
