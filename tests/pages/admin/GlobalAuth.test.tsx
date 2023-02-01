import { lightTheme, ThemeProvider } from "@deskpro/deskpro-ui";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react/";

import { act } from "react-dom/test-utils";

import React from "react";
import { GlobalAuth } from "../../../src/pages/admin/GlobalAuth";
import { mockTheme } from "../../__mocks__/themeMock";

const renderPage = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <GlobalAuth />
    </ThemeProvider>
  );
};

jest.mock("@deskpro/app-sdk", () => ({
  ...jest.requireActual("@deskpro/app-sdk"),
  useDeskproAppClient: () => ({ client: {} }),
  useDeskproAppEvents: (
    hooks: { [key: string]: (param: Record<string, unknown>) => void },
    deps: [] = []
  ) => {
    const deskproAppEventsObj = {
      data: {
        ticket: {
          id: 1,
          subject: "Test Ticket",
        },
      },
    };
    React.useEffect(() => {
      !!hooks.onChange && hooks.onChange(deskproAppEventsObj);
      !!hooks.onShow && hooks.onShow(deskproAppEventsObj);
      !!hooks.onReady && hooks.onReady(deskproAppEventsObj);
      hooks.onAdminSettingsChange({ clientId: "123", clientSecret: "456" });
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, deps);
  },
  useDeskproAppTheme: () => ({ theme: mockTheme }),
  proxyFetch: async () => fetch,
  useInitialisedDeskproAppClient: (
    fn: (client: {
      registerElement?: () => void;
      deregisterElement?: () => void;
      setTitle?: () => void;
      setAdminSetting?: () => void;
      oauth2?: () => {
        getAdminGenericCallbackUrl: (
          key: string,
          regexToken: string,
          regexKey: string
        ) =>
          | {
              callbackUrl: string;
              poll: () => Promise<unknown>;
            }
          | undefined;
      };
    }) => void
  ) => {
    fn({
      registerElement: () => {},
      deregisterElement: () => {},
      setTitle: () => {},
      setAdminSetting: () => {},
      oauth2: () => ({
        getAdminGenericCallbackUrl: (
          key: string,
          regexToken: string,
          regexKey: string
        ) => {
          const callbackUrl = `https://example.com/callback?code=asdf&state=${key}`;

          const code = callbackUrl.match(regexToken)?.groups?.token;

          const regexMatchedKey = callbackUrl.match(regexKey)?.groups?.key;

          if (regexMatchedKey !== key) return;

          const poll = () => new Promise((resolve) => resolve({ token: code }));

          return { callbackUrl, poll };
        },
      }),
    });
  },
}));

describe("Global Auth", () => {
  test("Signing in should work", async () => {
    const { getByText, getByTestId } = renderPage();
    window.open = jest.fn();
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      } as unknown as Response);
    act(() => {
      setTimeout(() => fireEvent.click(getByTestId("submit-button")), 1000);
    });

    const headingElement = await waitFor(
      () => getByText(/Authorization has been completed/i),
      {
        timeout: 3000,
      }
    );

    expect(headingElement).toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();

    cleanup();
  });
});
