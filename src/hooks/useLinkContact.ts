import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAsyncError } from "../hooks";
import { isUser, isOrganisation } from "../utils";
import { getContacts } from "../api/api";
import { ISettings, ContextData } from "../types/settings";

export const useLinkContact = () => {
  const { context } = useDeskproLatestAppContext<ContextData, ISettings>();
  const { client } = useDeskproAppClient();
  const [isLinking, setIsLinking] = useState(false);
  const navigate = useNavigate();
  const { asyncErrorHandler } = useAsyncError();

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

    let userInXero;

    try {
      userInXero = await getContacts(client, userEmail);
    } catch (error) {
      throw asyncErrorHandler(error as Error);
    }

    if (userInXero?.Contacts?.length) {
      await linkContact(userInXero.Contacts[0].ContactID);

      return userInXero.Contacts[0].ContactID;
    }
  }, [client, context, id, linkContact, asyncErrorHandler]);

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
