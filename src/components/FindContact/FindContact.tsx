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
const TESTACCS = [
  {
    id: 1,
    name: "Test Account 1",
    primary_email: "A@gmail.com",
  },
  {
    id: 2,
    name: "Test Account 2",
    primary_email: "b@gmail.com",
  },
];
export const FindContact = () => {
  const { linkContact, isLinking } = useLinkContact();
  const [inputText, setInputText] = useState<string>("");
  const { debouncedValue: deboundedText } = useDebounce(inputText, 300);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const contacts = useQueryWithClient(
    [QueryKeys.CONTACTS, deboundedText],
    (client) => getContacts(client, deboundedText)
  );

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Find Contact");
    client.registerElement("refreshButton", { type: "refresh_button" });
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
        <Stack style={{ margin: "auto" }}>
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
              text="Link Issue"
            ></Button>
            <HorizontalDivider />
          </Stack>
          <Stack vertical style={{ width: "100%" }}>
            {TESTACCS?.map((contact, i: number) => (
              <div style={{ width: "100%" }} key={i}>
                <Stack style={{ justifyContent: "space-between" }}>
                  <Stack vertical justify="start" key={i}>
                    <Radio
                      label={contact.name}
                      id={"option4"}
                      style={{ color: "#3A8DDE" }}
                      name={"sbtest"}
                      checked={selectedContact === contact.id.toString()}
                      onChange={() => setSelectedContact(contact.id.toString())}
                    />
                    <Label
                      style={{ marginLeft: "20px" }}
                      label={contact.primary_email}
                    ></Label>
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
