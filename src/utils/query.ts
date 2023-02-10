import { QueryClient } from "@tanstack/react-query";

export const query = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
    },
  },
});

export enum QueryKeys {
  CONTACTS = "contacts",
  CONTACT_BY_ID = "contactById",
}
