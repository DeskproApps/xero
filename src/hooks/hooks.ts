import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLinkContact = () => {
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const [isLinking, setIsLinking] = useState(false);
  const navigate = useNavigate();

  const deskproUser = context?.data.user;

  //check if contactid is string or num
  const linkContact = async (contactId: string) => {
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

    navigate("/contact/" + contactId);

    setIsLinking(false);
  };

  const getContactId = async () => {
    if (!context || !client) return;
    return (
      await client
        .getEntityAssociation("linkedXeroContacts", deskproUser.id)
        .list()
    )[0];
  };

  const unlinkContact = async () => {
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
  };

  return {
    linkContact,
    isLinking,
    unlinkContact,
    getContactId,
    context,
    client,
  };
};
