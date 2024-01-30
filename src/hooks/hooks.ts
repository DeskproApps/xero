import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContacts } from "../api/api";

export const useLinkContact = () => {
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const [isLinking, setIsLinking] = useState(false);
  const navigate = useNavigate();

  const id = context?.data.user?.id || context?.data.organisation.id;

  const linkContact = useCallback(
    async (contactId: string) => {
      if (!context || !contactId || !client) return;

      setIsLinking(true);

      const getEntityAssociationData = (await client
        ?.getEntityAssociation("linkedXeroContacts", id)
        .list()) as string[];

      if (getEntityAssociationData.length > 0) {
        await client
          ?.getEntityAssociation("linkedXeroContacts", id)
          .delete(getEntityAssociationData[0]);
      }

      await client
        ?.getEntityAssociation("linkedXeroContacts", id)
        .set(contactId);

      navigate("/");

      setIsLinking(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, client, id]
  );

  const getContactId = useCallback(async () => {
    if (!context || !client || !id) return;

    const linkedContact = (
      await client.getEntityAssociation("linkedXeroContacts", id.id).list()
    )[0];

    if (linkedContact) return linkedContact;

    const userEmail = id.primaryEmail;

    const userInXero = await getContacts(client, userEmail);

    if (userInXero.Contacts.length !== 0) {
      await linkContact(userInXero.Contacts[0].ContactID);

      return userInXero.Contacts[0].ContactID;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, context]);

  const unlinkContact = useCallback(async () => {
    if (!context || !client) return;

    (async () => {
      const entityId = (
        await client.getEntityAssociation("linkedXeroContacts", id).list()
      )[0];

      await client
        .getEntityAssociation("linkedXeroContacts", entityId)
        .delete(entityId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, context]);
  return {
    linkContact,
    isLinking,
    unlinkContact,
    getContactId,
    context,
    client,
  };
};
