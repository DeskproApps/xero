import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react/";
import React from "react";
import * as APIFn from "../../../src/api/api";
import { FindCreateAccount } from "../../../src/pages/FindCreate/Contact";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <FindCreateAccount />
    </ThemeProvider>
  );
};

jest.mock("../../../src/api/api", () => {
  const contactArr: unknown[] = [];

  return {
    ...jest.requireActual("../../../src/api/api"),
    postContact: jest.fn().mockImplementation((data) => {
      contactArr.push({ id: 1, ...data });
      return contactArr;
    }),
    getContacts: () => {
      return contactArr;
    },
  };
});

describe("Find Create Contact", () => {
  test("Creating Contact and finding the same contact should work", async () => {
    const { getByText, getByTestId } = renderPage();

    fireEvent.click(getByText(/Create Contact/i));

    fireEvent.change(getByTestId("input-Name"), {
      target: { value: "John Doe" },
    });

    fireEvent.click(getByTestId("button-submit"));

    await waitFor(() => {
      expect(APIFn.postContact).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(APIFn.getContacts()).toHaveLength(1);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
