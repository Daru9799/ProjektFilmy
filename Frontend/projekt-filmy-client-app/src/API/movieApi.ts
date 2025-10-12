import axios from "axios";
import { Movie } from "../models/Movie";
import { Person } from "../models/Person";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/api";
import qs from "qs";

//to do: OBSLUGA BLEDOW
export const useMovieById = (id: string | undefined) => {
  return useQuery<Movie>({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/Movies/${id}`);
      return data;
    },
    retry: false,
  });
};

//to do: OBSLUGA BLEDOW
export const useActorsByMovieId = (movieId: string | undefined) => {
  return useQuery<Person[]>({
    queryKey: ["actors", movieId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/People/by-filters`, {
        params: {
          pageNumber: 1,
          pageSize: 2,
          noPagination: true,
          role: 1,
          movieId: movieId,
        },
      });

      const actorsArray = response.data?.data?.$values;
      if (Array.isArray(actorsArray)) {
        return actorsArray;
      } else {
        return [];
      }
    },
    retry: false,
  });
};

//to do: OBSLUGA BLEDOW (jest niepełna zrobiona zeby modal dzialał poprawnie)
export const useMoviesByFilters = (page: number, pageSize: number, titleSearch?: string, orderBy?: string, sortDirection?: string, categoryNames?: string[], countryNames?: string[], actorsList?: string[], directorsList?: string[]) => {
  return useQuery<{ movies: Movie[]; totalPages: number }>({
    queryKey: ["movies", page, pageSize, titleSearch, orderBy, sortDirection, categoryNames, countryNames, actorsList, directorsList],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/Movies/by-filters`, {
          params: {
            pageNumber: page,
            pageSize,
            titleSearch,
            orderBy,
            sortDirection,
            categoryNames,
            countryNames,
            actorsList,
            directorsList,
          },
            paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });

        return {
          movies: data.data?.$values ?? [],
          totalPages: data.totalPages ?? 0,
        };
      } catch (err: any) {
        if (err.response?.status === 404) {
          return { movies: [], totalPages: 1 };
        }
        throw err;
      }
    },
    retry: false,
    placeholderData: keepPreviousData
  });
};

//to do: OBSLUGA BLEDOW
export const useMoviesByCollectionId = (movieCollectionId: string | null, page: number, pageSize: number) => {
  return useQuery<{ movies: Movie[]; totalPages: number }>({
    queryKey: ["moviesByCollection", movieCollectionId, page, pageSize],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/Movies/by-collectionId/${movieCollectionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            pageNumber: page,
            pageSize,
          },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });

        return {
          movies: data?.$values ?? [],
          totalPages: data.totalPages ?? 1,
        };
      } catch (err: any) {
        if (err.response?.status === 404) {
          return { movies: [], totalPages: 1 };
        }
        throw err;
      }
    },
    retry: false,
    placeholderData: { movies: [], totalPages: 1 },
  });
};

////////////////////////////////////////////////////////////////////////////////////////

// Fetch movie reviews
export const fetchMovieReviews = async (
  movieId: string,
  setReviews: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const reviewsResponse = await axios.get(
      `https://localhost:7053/api/Reviews/by-movie-id/${movieId}`,
      {
        params: {
          pageNumber: 1,
          pageSize: 2,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Dodanie nagłówka z tokenem
        },
      }
    );

    if (reviewsResponse.status === 200) {
      const reviewsData = reviewsResponse.data.data.$values;
      setReviews(reviewsData);
    }
  } catch (reviewsError) {
    if (
      axios.isAxiosError(reviewsError) &&
      reviewsError.response?.status === 404
    ) {
      setReviews([]);
      console.log("Nie znaleznio recenzji dla tego filmu");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(reviewsError);
    }
  } finally {
    setLoading(false);
  }
};

export const fetchUserReviewForMovie = async (
  userN: string,
  Id: string,
  setReview: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Brak tokenu, użytkownik nie jest zalogowany.");
    return; //Jeśli brak tokenu nie zaciąga danych z API
  }

  try {
    const response = await axios.get(
      `https://localhost:7053/api/Reviews/by-username-and-movie-id`,
      {
        params: {
          userName: userN,
          movieId: Id,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      const reviewsData = response.data;
      setReview(reviewsData);
    }
  } catch (reviewsError) {
    if (
      axios.isAxiosError(reviewsError) &&
      reviewsError.response?.status === 404
    ) {
      setReview(null);
      console.log("Nie znaleznio recenzji dla tego filmu");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(reviewsError);
    }
  }
};

export const checkIfInPlanned = async (
  movieId: string | undefined,
  setList: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Brak tokenu, użytkownik nie jest zalogowany.");
    return; //Jeśli brak tokenu nie zaciąga danych z API
  }

  try {
    const response = await axios.get(
      `https://localhost:7053/api/Movies/check-if-in-list/Planned/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      if (response.data === true) {
        setList("Planowany");
      }
      console.log("Pomyślnie sprawdzono czy film planowany.");
    }
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      setList(null);
      console.log("Ten film nie istnieje");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(err);
    }
  }
};

export const checkIfInWatched = async (
  movieId: string | undefined,
  setList: React.Dispatch<React.SetStateAction<string | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Brak tokenu, użytkownik nie jest zalogowany.");
    return; //Jeśli brak tokenu nie zaciąga danych z API
  }

  try {
    const response = await axios.get(
      `https://localhost:7053/api/Movies/check-if-in-list/Watched/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      if (response.data === true) {
        setList("Obejrzany");
      }
      console.log("Pomyślnie sprawdzono czy film obejrzany.");
    }
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      setList(null);
      console.log("Ten film nie istnieje.");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(err);
    }
  }
};

export const addToPlanned = async (
  movieId: string | undefined,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    await axios.post(
      "https://localhost:7053/api/Movies/planned/add-movie",
      {
        movieId: movieId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err: any) {
    setError(err);
    console.log("Błąd podczas dodawania do planowanych.");
  }
};

export const addToWatched = async (
  movieId: string | undefined,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    await axios.post(
      "https://localhost:7053/api/Movies/watched/add-movie",
      {
        movieId: movieId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err: any) {
    setError(err);
    console.log("Błąd podczas dodawania do obejrzanych.");
  }
};

export const deleteFromWatched = async (
  movieId: string | undefined,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    await axios.delete(
      `https://localhost:7053/api/Movies/watched/delete-from-watched/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err: any) {
    setError(err);
    console.log("Błąd podczas usuwania z obejrzanych.");
  }
};

export const deleteFromPlanned = async (
  movieId: string | undefined,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    await axios.delete(
      `https://localhost:7053/api/Movies/planned/delete-from-planned/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err: any) {
    setError(err);
    console.log("Błąd podczas usuwania z planowanych.");
  }
};

export const fetchMoviesListByIds = async (
  moviesIds: string[] | null,
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
): Promise<void> => {
  if (!moviesIds || moviesIds.length === 0) {
    setMovies([]);
    return;
  }

  try {
    const response = await axios.get(
      "https://localhost:7053/api/movies/get-list-by-id",
      {
        params: { movieIdList: moviesIds },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Przekształć odpowiedź API do oczekiwanego formatu
    const moviesData = response.data.$values || [];
    //console.log("Pobrane filmy:", moviesData);
    setMovies(moviesData);
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};