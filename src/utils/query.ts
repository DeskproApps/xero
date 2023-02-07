import { IDeskproClient, useDeskproAppClient } from "@deskpro/app-sdk";
import {
  QueryClient,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

export const query = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnWindowFocus: false,
    },
  },
});

export function useQueryWithClient<
  TQueryFnData = unknown,
  TError = unknown,
  TData extends TQueryFnData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: string | readonly unknown[],
  queryFn: (client: IDeskproClient) => Promise<TQueryFnData>,
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<TQueryFnData> {
  const { client } = useDeskproAppClient();

  const key = Array.isArray(queryKey) ? queryKey : [queryKey];

  return useQuery(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    key,
    () => (client && queryFn(client)) as Promise<TQueryFnData>,
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      ...(options ?? {}),
      enabled:
        options?.enabled === undefined ? !!client : true && options?.enabled,
    }
  );
}
