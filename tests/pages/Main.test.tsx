import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, render, waitFor } from "@testing-library/react/";
import React from "react";
import { Main } from "../../src/pages/Main";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <Main />
    </ThemeProvider>
  );
};

jest.mock("../../src/hooks/hooks", () => ({
  ...jest.requireActual("../../src/hooks/hooks"),
  useLinkContact: () => ({
    getContactId: () => 1,
    context: {},
    client: {},
  }),
}));

jest.mock("../../src/api/api", () => {
  return {
    ...jest.requireActual("../../src/api/api"),
    getContactById: () => ({
      Contacts: [
        {
          ContactID: 1,
          Name: "John Doe",
          EmailAddress: "johndoe@gmail.com",
        },
      ],
    }),
    getNotesByContactId: () => ({
      HistoryRecords: [
        {
          Details: "This is a note",
          User: "John Doee",
          DateUTC: "/Date(1234+000)",
          Changes: "Note",
        },
      ],
    }),
    getPurchaseOrdersByContactId: () => ({
      PurchaseOrders: [
        {
          PurchaseOrderID: 1,
          Reference: "PO-123",
          Status: "AUTHORISED",
          Total: 110,
          CurrencyCode: "EUR",
          Date: "/Date(10123+000)",
          PurchaseOrderNumber: "PO-123",
        },
      ],
    }),
    getInvoicesByContactId: () => ({
      Invoices: [
        {
          InvoiceID: 1,
          Reference: "INV-123",
          Status: "PAID",
          AmountDue: 120,
          CurrencyCode: "EUR",
          DueDate: "/Date(1675957117279+000)",
          InvoiceNumber: "INV-123",
        },
      ],
    }),
    getBillsByContactId: () => ({
      Invoices: [
        {
          InvoiceID: 1,
          Reference: "INV-123",
          Status: "BLANK",
          AmountDue: 100,
          CurrencyCode: "EUR",
          DueDate: "/Date(1675957117279+000)",
          InvoiceNumber: "INV-123",
        },
      ],
    }),
    getQuotesByContactId: () => ({
      Quotes: [
        {
          QuoteID: 1,
          Date: "/Date(11+000)",
          Total: 140,
          CurrencyCode: "EUR",
          Title: "Quote Title",
        },
      ],
    }),
  };
});

jest.mock("../../src/components/LogoAndLinkButton/LogoAndLinkButton", () => ({
  LogoAndLinkButton: () => <div>LogoAndLinkButton</div>,
}));

describe("Main", () => {
  test("Main page should show all data correctly", async () => {
    const { getByText, getAllByText } = renderPage();

    const ContactNameEl = await waitFor(() => getAllByText(/John Doe/i)[0]);

    const AmountEl = await waitFor(() => getByText(/€100.00/));

    const noteEl = await waitFor(() => getByText(/This is a note/));

    const invoiceStatusEl = await waitFor(() => getByText(/Paid/));

    const timeEl = await waitFor(() => getByText(/2\/9\/2023/));

    await waitFor(() => {
      [ContactNameEl, AmountEl, noteEl, invoiceStatusEl, timeEl].forEach(
        (el) => {
          expect(el).toBeInTheDocument();
        }
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
