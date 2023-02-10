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

  const deskproUser = context?.data.user;

  //check if contactid is string or num
  const linkContact = useCallback(
    async (contactId: string) => {
      if (!context || !contactId || !client) return;

      setIsLinking(true);

      const deskproUser = context?.data.user;

      const getEntityAssociationData = (await client
        ?.getEntityAssociation("linkedXeroContacts", deskproUser.id)
        .list()) as string[];

      if (getEntityAssociationData.length > 0) {
        await client
          ?.getEntityAssociation("linkedXeroContacts", deskproUser.id)
          .delete(getEntityAssociationData[0]);
      }

      await client
        ?.getEntityAssociation("linkedXeroContacts", deskproUser.id)
        .set(contactId);

      navigate("/");

      setIsLinking(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, client]
  );

  const getContactId = useCallback(async () => {
    if (!context || !client || !deskproUser) return;

    const linkedContact = (
      await client
        .getEntityAssociation("linkedXeroContacts", deskproUser.id)
        .list()
    )[0];

    if (linkedContact) return linkedContact;

    const userEmail = deskproUser.primaryEmail;

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
      const id = (
        await client
          .getEntityAssociation("linkedXeroContacts", deskproUser.id)
          .list()
      )[0];

      await client
        .getEntityAssociation("linkedXeroContacts", deskproUser.id)
        .delete(id);

      navigate("/");
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
