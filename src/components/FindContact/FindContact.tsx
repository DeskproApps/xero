import {
  Button,
  Input,
  Label,
  Radio,
  Spinner,
  Stack,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import useDebounce from "../../utils/debounce";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { useQueryWithClient } from "../../hooks/useQueryWithClient";
import { QueryKeys } from "../../utils/query";
import { getContacts } from "../../api/api";
import { useLinkContact } from "../../hooks/hooks";
import { IContactList } from "../../api/types";
import { LogoAndLinkButton } from "../LogoAndLinkButton/LogoAndLinkButton";

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
    <Stack vertical style={{ width: "100%" }}>
      <Input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter item details"
        type="text"
        leftIcon={faMagnifyingGlass}
      />
      {contacts.isLoading ? (
        <Stack style={{ margin: "auto", marginTop: "20px" }}>
          <Spinner size="extra-large" />
        </Stack>
      ) : (
        <Stack vertical style={{ width: "100%", marginTop: "6px" }}>
          <Stack
            vertical
            style={{ width: "100%", justifyContent: "space-between" }}
            gap={2}
          >
            <Button
              onClick={() => selectedContact && linkContact(selectedContact)}
              disabled={isLinking}
              text="Link Contact"
            ></Button>
            <HorizontalDivider />
          </Stack>
          <Stack vertical style={{ width: "100%" }}>
            {contacts.data?.Contacts?.map((contact, i: number) => (
              <div style={{ width: "100%" }} key={i}>
                <Stack style={{ justifyContent: "space-between" }}>
                  <Stack vertical justify="start" key={i}>
                    <Radio
                      label={contact.Name}
                      style={{ color: "#3A8DDE" }}
                      checked={selectedContact === contact.ContactID}
                      onChange={() => setSelectedContact(contact.ContactID)}
                    />
                    <Stack>
                      <Label
                        style={{ marginLeft: "20px" }}
                        label={contact.EmailAddress || "No email address"}
                      ></Label>
                      <LogoAndLinkButton
                        endpoint={`/Contacts/${contact.ContactID}`}
                      />
                    </Stack>
                  </Stack>
                </Stack>
                <HorizontalDivider />
              </div>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
