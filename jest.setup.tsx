/* eslint-disable @typescript-eslint/no-explicit-any */
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom/extend-expect";
import { TextDecoder, TextEncoder } from "util";
import * as React from "react";
import { mockTheme } from "./tests/__mocks__/themeMock";

global.TextEncoder = TextEncoder;
//for some reason the types are wrong, but this works
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextDecoder = TextDecoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.React = React;

// jest.mock("./src/hooks.ts", () => ({
//   ...jest.requireActual("./src/hooks.ts"),
//   useQueryWithClient: (queryKey: string, queryFn: () => any, options: any) => {
//     queryKey;
//     options;
//     if (!options || options?.enabled == null || options?.enabled == true) {
//       return {
//         isSuccess: true,
//         data: queryFn(),
//         isLoading: false,
//       };
//     }
//     return {
//       isSuccess: false,
//       data: null,
//       isLoading: false,
//     };
//   },
// }));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("./src/hooks/useQueryWithClient.ts", () => ({
  ...jest.requireActual("./src/hooks/useQueryWithClient.ts"),
  useQueryWithClient: (queryKey: string, queryFn: () => any, options: any) => {
    queryKey;
    options;
    if (!options || options?.enabled == null || options?.enabled == true) {
      return {
        isSuccess: true,
        data: queryFn(),
        isLoading: false,
      };
    }
    return {
      isSuccess: false,
      data: null,
      isLoading: false,
    };
  },
  useQueryMutationWithClient: (queryFn: () => any) => {
    return {
      mutate: queryFn,
      isSuccess: true,
      isLoading: false,
      data: null,
    };
  },
}));

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
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, deps);
  },
  useInitialisedDeskproAppClient: (
    callback: (param: Record<string, unknown>) => void
  ) => {
    callback({
      registerElement: () => {},
      deregisterElement: () => {},
      setTitle: () => {},
    });
  },
  useDeskproAppTheme: () => ({ mockTheme }),
  proxyFetch: async () => fetch,
  HorizontalDivider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
