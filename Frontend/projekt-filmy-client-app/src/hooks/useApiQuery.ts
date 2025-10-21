import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getApiError } from "../functions/getApiError";

export function useApiQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = unknown[]
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> & { apiError: ReturnType<typeof getApiError> | null } {
  const query = useQuery(options)

  return {
    ...query,
    apiError: query.error ? getApiError(query.error as unknown as AxiosError) : null,
  }
}