import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContacts } from "../api/api";
import { ISettings, ContextData } from "../types/settings";
import { isUser, isOrganisation } from "../utils";

export const useLinkContact = () => {
  const { context } = useDeskproLatestAppContext<ContextData, ISettings>();
  const { client } = useDeskproAppClient();
  const [isLinking, setIsLinking] = useState(false);
  const navigate = useNavigate();

  const id = isUser(context)
    ? context?.data?.user?.id
    : isOrganisation(context)
    ? context?.data?.organisation?.id
    : null;

  const linkContact = useCallback(
    async (contactId: string) => {
      if (!context || !contactId || !client || !id) return;

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
    [navigate, context, client, id]
  );

  const getContactId = useCallback(async () => {
    if (!context || !client || !id) {
      return;
    }

    const linkedContact = (
      await client.getEntityAssociation("linkedXeroContacts", id).list()
    )[0];

    if (linkedContact) {
      return linkedContact;
    }

    const userEmail = isUser(context) ? context.data?.user?.primaryEmail : undefined;

    const userInXero = await getContacts(client, userEmail);

    if (userInXero.Contacts.length !== 0) {
      await linkContact(userInXero.Contacts[0].ContactID);

      return userInXero.Contacts[0].ContactID;
    }
  }, [client, context, id, linkContact]);

  const unlinkContact = useCallback(async () => {
    if (!context || !client || !id) {
      return;
    }

    (async () => {
      const entityId = (
        await client.getEntityAssociation("linkedXeroContacts", id).list()
      )[0];

      await client
        .getEntityAssociation("linkedXeroContacts", entityId)
        .delete(entityId);
    })();
  }, [client, context, id]);
  return {
    linkContact,
    isLinking,
    unlinkContact,
    getContactId,
    context,
    client,
  };
};
