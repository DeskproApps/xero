/* eslint-disable @typescript-eslint/no-explicit-any */
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom/extend-expect";
import { TextDecoder, TextEncoder } from "util";
import * as React from "react";

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
