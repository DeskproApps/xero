import { FC, useCallback, MouseEvent } from "react";
import styled from "styled-components";
import { Stack, Radio, P5 } from "@deskpro/deskpro-ui";
import { Link } from "@deskpro/app-sdk";
import { Overflow, Secondary } from "../Typography";
import { LogoAndLinkButton } from "../../LogoAndLinkButton/LogoAndLinkButton";
import { IContact } from "../../../api/types";

type Props = {
  selectedContact: IContact["ContactID"]|null;
  contact: IContact;
  onChange: (contactId: IContact["ContactID"]) => void;
};

const RadioBox = styled(Radio)`
  width: 12px;
`;

const ContactBox = styled.div`
  width: calc(100% - 12px - 6px); // 100% - radio - flex gap
  flex-grow: 1;
`;

const Name: FC<Pick<Props, "contact"|"onChange">> = ({ contact, onChange }) => {
  const clickHandler = useCallback((e: MouseEvent) => {
    e.preventDefault();
    onChange(contact.ContactID);
  }, [contact.ContactID, onChange]);

  return (
    <P5>

      <Link href="#" onClick={clickHandler}>{contact.Name}</Link>
    </P5>
  )
};

const ContactItem: FC<Props> = ({ contact, onChange, selectedContact }) => {
  return (
    <Stack align="center" justify="space-between" gap={6} style={{ width: "100%" }}>
      <RadioBox
        checked={selectedContact === contact.ContactID}
        onChange={() => onChange(contact.ContactID)}
      />
      <ContactBox style={{ boxSizing: "border-box" }}>
        <Name contact={contact} onChange={onChange}/>
        <Stack justify="space-between" wrap="nowrap">
          <Overflow as={P5}>
            <Secondary type="p5">{contact.EmailAddress || "No email address"}</Secondary>
          </Overflow>
          <LogoAndLinkButton endpoint={`/Contacts/View/${contact.ContactID}`} />
        </Stack>
      </ContactBox>
    </Stack>
  )
};

export { ContactItem };
