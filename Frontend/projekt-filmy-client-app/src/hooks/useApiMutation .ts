import {  useMutation, UseMutationOptions } from "@tanstack/react-query";
import { getApiError } from "../functions/getApiError";
import { AxiosError } from "axios";

//Customowy hook żeby przy mutacji oprócz zwracania podstawowych properties zwracał dodatkowo obiekt apiError 
//https://github.com/TanStack/query/discussions/3526

export function useApiMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(options: UseMutationOptions<TData, TError, TVariables, TContext>) {
  const mutation = useMutation<TData, TError, TVariables, TContext>(options);

  return {
    ...mutation,
    apiError: mutation.error ? getApiError(mutation.error as unknown as AxiosError): null,
  };
}