import { useState, Fragment } from "react";
import { Button, Input } from "@deskpro/deskpro-ui";
import { useInitialisedDeskproAppClient, LoadingSpinner } from "@deskpro/app-sdk";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import useDebounce from "../../utils/debounce";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { useQueryWithClient } from "../../hooks/useQueryWithClient";
import { QueryKeys } from "../../utils/query";
import { getContacts } from "../../api/api";
import { useLinkContact } from "../../hooks";
import { IContactList } from "../../api/types";
import { ContactItem } from "../common";

export const FindContact = () => {
  const { linkContact, isLinking } = useLinkContact();
  const [inputText, setInputText] = useState<string>("");
  const { debouncedValue: deboundedText } = useDebounce(inputText, 300);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const contacts = useQueryWithClient<IContactList>(
    [QueryKeys.CONTACTS, deboundedText],
    (client) => getContacts(client, deboundedText)
  );

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Find Contact");
  });

  return (
    <>
      <Input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter item details"
        type="text"
        leftIcon={faMagnifyingGlass as never}
      />
      <div style={{ margin: "8px 0" }}>
        <Button
          onClick={() => selectedContact && linkContact(selectedContact)}
          disabled={isLinking}
          text="Link Contact"
        />
      </div>
      <HorizontalDivider />
      {contacts.isLoading
        ? <LoadingSpinner/>
        : contacts.data?.Contacts?.map((contact) => (
          <Fragment key={contact.ContactID}>
            <ContactItem
              contact={contact}
              selectedContact={selectedContact}
              onChange={setSelectedContact}
            />
            <HorizontalDivider />
          </Fragment>
        ))}
    </>
  );
};
