import axios, { AxiosResponse } from "axios";
import { PaginationResponse } from "./PaginationResponse";
import { Achievement} from "../models/Achievement";
import { UserAchievement } from "../models/UserAchievement";

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


export const fetchUserAchievements = async (
  page: number,
  pageSize: number,
  sortOrder: string,
  sortDirection: string,
  setAchievements: React.Dispatch<React.SetStateAction<UserAchievement[]>>,
  setPagination: React.Dispatch<
    React.SetStateAction<{
      totalItems: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>
  >,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  userName: string
) => {
  setLoading(true);

  console.log("Wywołanie fetchUserAchievements");
  console.log("Parametry zapytania:", {
    page,
    pageSize,
    sortOrder,
    sortDirection,
    userName,
  });

  try {
    const response: AxiosResponse<PaginationResponse<UserAchievement>> = await axios.get(
      `https://localhost:7053/api/Achievement/by-user-id/${userName}`,
      {
        params: {
          pageNumber: page,
          pageSize,
          orderBy: sortOrder,
          sortDirection,
        },
      }
    );

    const {
      data: { $values },
      totalItems,
      pageNumber,
      pageSize: returnedPageSize,
      totalPages,
    } = response.data;

    console.log("Odpowiedź API:", response.data);
    console.log("Osiągnięcia:", $values);

    setAchievements($values);
    setPagination({
      totalItems,
      pageNumber,
      pageSize: returnedPageSize,
      totalPages,
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios Error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      setError(`${error.response.status} - ${error.response.statusText || "Błąd zapytania"}`);
    } else {
      console.error("Inny błąd:", error);
      setError("Błąd podczas pobierania danych.");
    }
  } finally {
    setLoading(false);
  }
};