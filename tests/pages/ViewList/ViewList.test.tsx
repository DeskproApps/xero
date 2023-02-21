import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { ViewList } from "../../../src/pages/ViewList/ViewList";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <ViewList />
    </ThemeProvider>
  );
};
jest.mock("../../../src/api/api", () => {
  return {
    ...jest.requireActual("../../../src/api/api"),
    getContactById: () => ({
      Contacts: [
        {
          ContactID: 1,
          Name: "John Doe",
          EmailAddress: "johndoe@gmail.com",
        },
      ],
    }),
  };
});

jest.mock("../../../src/hooks/useQueryWithClient", () => ({
  ...jest.requireActual("../../../src/hooks/useQueryWithClient"),
  useQueryMutationWithClient: () => ({
    data: {
      Contacts: [
        {
          ContactID: 1,
          Name: "John Doe",
          EmailAddress: "johndoe@gmail.com",
        },
      ],
    },
    mutate: () => {},
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: "/view",
  }),
  useParams: () => ({
    objectName: "contact",
    objectId: 1,
  }),
}));

describe("ViewList", () => {
  test("ViewList should show a contact correctly", async () => {
    const { getAllByText } = renderPage();

    const ContactNameEl = await waitFor(() => getAllByText(/John Doe/i)[0]);

    await waitFor(() => {
      [ContactNameEl].forEach((el) => {
        expect(el).toBeInTheDocument();
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
