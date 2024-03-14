import { Stack } from "@deskpro/deskpro-ui";
import {
  TwoButtonGroup,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { FindContact } from "../../components/FindContact/FindContact";
import { CreateAccount } from "../../components/CreateContact/CreateContact";
import { useNavigate } from "react-router-dom";

export const FindCreateAccount = () => {
  const [page, setPage] = useState<0 | 1>(0);
  const navigate = useNavigate();

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("xeroMenuButton");
  });

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "xeroHomeButton":
          navigate("/redirect");
      }
    },
  });

  return (
    <Stack vertical>
      <Stack>
        <TwoButtonGroup
          selected={
            {
              0: "one",
              1: "two",
            }[page] as "one" | "two"
          }
          oneIcon={faMagnifyingGlass}
          twoIcon={faPlus}
          oneLabel="Find Contact"
          twoLabel="Create Contact"
          oneOnClick={() => setPage(0)}
          twoOnClick={() => setPage(1)}
        ></TwoButtonGroup>
      </Stack>

      {
        {
          0: <FindContact />,
          1: <CreateAccount />,
        }[page]
      }
    </Stack>
  );
};
