import axios, { AxiosResponse } from "axios";
import { PaginationResponse } from "./PaginationResponse";
import { Achievement } from "../models/Achievement";

export const fetchAchievements = async (
  page: number,
  pageSize: number,
  sortOrder: string,
  sortDirection: string,
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>,
  setPagination: React.Dispatch<
    React.SetStateAction<{
      totalItems: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>
  >,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response: AxiosResponse<PaginationResponse<Achievement>> =
      await axios.get("https://localhost:7053/api/Achievement/all", {
        params: {
          pageNumber: page,
          pageSize,
          orderBy: sortOrder,
          sortDirection,
        },
      });

    const {
      data,
      totalItems,
      pageNumber,
      pageSize: returnedPageSize,
      totalPages,
    } = response.data;

    setAchievements(data.$values);
    setPagination({
      totalItems,
      pageNumber,
      pageSize: returnedPageSize,
      totalPages,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      setError(`${error.response.status} - ${error.response.statusText}`);
    } else {
      setError("Błąd podczas pobierania danych.");
    }
  } finally {
    setLoading(false);
  }
};
