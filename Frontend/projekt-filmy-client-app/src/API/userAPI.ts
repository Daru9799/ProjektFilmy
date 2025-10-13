import axios from "axios";
import { API_BASE_URL } from "../constants/api";
import { Review } from "../models/Review";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

//to do: OBSLUGA BLEDOW
export const useUserReviews = (userName: string | undefined, page: number, pageSize: number, sortOrder: string = "desc", sortDirection: string = "year") => {
  return useQuery<{ reviews: Review[]; totalPages: number }>({
    queryKey: ["userReviews", userName, page, pageSize, sortOrder, sortDirection],
    queryFn: async () => {
      if (!userName) return { reviews: [], totalPages: 0 };

      try {
        const { data } = await axios.get(`${API_BASE_URL}/Reviews/by-username/${userName}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            pageNumber: page,
            pageSize,
            orderBy: sortOrder,
            sortDirection: sortDirection,
          },
        });

        return {
          reviews: data.data?.$values ?? [],
          totalPages: data.totalPages ?? 1,
        };
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          return { reviews: [], totalPages: 1 };
        }
        throw err;
      }
    },
    retry: false,
    placeholderData: keepPreviousData,
  });
};

/////////////////////////////////////////////////////////////////////

export const fetchUserData = async (
  userName: string | undefined,
  setUser: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: (path: string) => void
) => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(
      `https://localhost:7053/api/Users/by-username/${userName}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setUser(response.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        setError("Błąd sieci: nie można połączyć się z serwerem.");
      } else if (err.response.status === 404) {
        navigate("/404");
        return;
      } else {
        setError(`Błąd: ${err.response.status} - ${err.response.statusText}`);
      }
    } else {
      setError("Wystąpił nieoczekiwany błąd.");
    }
    console.error(err);
  } finally {
    setLoading(false);
  }
};

export const fetchUserStatistics = async (
  userName: string,
  setUser: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(
      `https://localhost:7053/api/users/statistics/${userName}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setUser(response.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        setError("Błąd sieci: nie można połączyć się z serwerem.");
      } else if (err.response.status === 404) {
        setError(`Użytkownik o nazwie '${userName}' nie został znaleziony.`);
      } else {
        setError(`Błąd: ${err.response.status} - ${err.response.statusText}`);
      }
    } else {
      setError("Wystąpił nieoczekiwany błąd.");
    }
    console.error(err);
  } finally {
    setLoading(false);
  }
};

//change Role

export const changeRole = async (userId: string, newRole: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.patch(
    `https://localhost:7053/api/Users/change-role/${userId}`,
    { newRole },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const addFollowMovie = async (movieId: string | undefined) => {
  if (!movieId) {
    console.error("Brak ID filmu!");
    return;
  }
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `https://localhost:7053/api/Users/add-follow-movie/${movieId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const removeFollowMovie = async (movieId: string | undefined) => {
  if (!movieId) {
    console.error("Brak ID filmu!");
    return;
  }

  const token = localStorage.getItem("token");
  const response = await axios.delete(
    `https://localhost:7053/api/Users/delete-follow-movie/${movieId}`,
    {
      data: {},

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const addFollowPerson = async (personId: string | undefined) => {
  if (!personId) {
    console.error("Brak ID filmu!");
    return;
  }
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `https://localhost:7053/api/Users/add-follow-person/${personId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const removeFollowPerson = async (personId: string | undefined) => {
  if (!personId) {
    console.error("Brak ID osoby!");
    return;
  }

  const token = localStorage.getItem("token");
  const response = await axios.delete(
    `https://localhost:7053/api/Users/delete-follow-person/${personId}`,
    {
      data: {},

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
