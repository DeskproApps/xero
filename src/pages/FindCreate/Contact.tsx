import {
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import{Button, ButtonGroup,} from "@deskpro/deskpro-ui";

import { useState } from "react";
import { FindContact } from "../../components/FindContact/FindContact";
import { CreateAccount } from "../../components/CreateContact/CreateContact";
import { useNavigate } from "react-router-dom";
import { Container } from "../../components/Layout";

export const FindCreateAccount = () => {
  const [page, setPage] = useState<0 | 1>(0);
  const navigate = useNavigate();

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("refreshButton");
    client.deregisterElement("xeroHomeButton");
    client.deregisterElement("xeroLink");
    client.deregisterElement("xeroMenuButton");

    client.registerElement("refreshButton", { type: "refresh_button" });
    client.registerElement("xeroHomeButton", { type: "home_button" });
  });

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "xeroHomeButton":
          navigate("/redirect");
      }
    },
  });

  const isCreatingContact = page === 1

  type NavigationButton = {
    text: string;
    icon: "outline-dazzle-search" | "outline-dazzle-plus-large";
    activeCondition: boolean;
    page: 0| 1 
}

// While this might seem a bit over-engineered, it was intentionally designed for flexibility.
// If the navigation button properties need to be updated (e.g., changing the size or intent),
// changes can be made in one central location, reducing duplication.

  const navigationButtons: NavigationButton[] = [
    {
      text: "Find Contact",
      icon: "outline-dazzle-search",
      activeCondition: !isCreatingContact,
      page: 0
    },
    {
      text: "Create Contact",
      icon: "outline-dazzle-plus-large",
      activeCondition: isCreatingContact,
      page: 1
    }
  ]

  return (
    <Container>
      <ButtonGroup style={{width: "100%", display: "flex", justifyContent: "center"}}>
        {navigationButtons.map((navButton)=>{
          return (
          <Button key={navButton.text} style={{width: "100%"}} intent="secondary" icon={navButton.icon}  size="xlarge" onClick={() => setPage(navButton.page)} active={navButton.activeCondition} text={navButton.text} title={navButton.text}/>
          )
        })}        
      </ButtonGroup>

      {
        {
          0: <FindContact />,
          1: <CreateAccount />,
        }[page]
      }
    </Container>
  );
};
