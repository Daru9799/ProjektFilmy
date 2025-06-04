import axios from "axios";
import qs from "qs";
import { Movie } from "../models/Movie";

// Fetch movie data
export const fetchMovieData = async (
  movieId: string | undefined, 
  setMovie: React.Dispatch<React.SetStateAction<any>>, 
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const movieResponse = await axios.get(`https://localhost:7053/api/Movies/${movieId}`);
    setMovie(movieResponse.data);
  } catch (movieError) {
    if (axios.isAxiosError(movieError)) {
      if (movieError.response?.status === 404) {
        setError("Nie znaleziono filmu");
      } else {
        setError("Błąd podczas wczytywaina danych");
      }
    } else {
      setError("Nieoczekiwany błąd");
    }
    console.error(movieError);
  }
};
// https://localhost:7053/api/People/by-filters?pageNumber=1&pageSize=2&noPagination=true&role=1&movieId=08dd7b57-97ba-4c79-852b-164b472a2b02
// Fetch actors data   -- !!!!!  DO ZMIANY
export const fetchActorsData = async (
  movieId: string,
  setActors: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.get("https://localhost:7053/api/People/by-filters", {
      params: {
        pageNumber: 1,
        pageSize: 2,
        noPagination: true,
        role: 1,
        movieId: movieId,
      },
    });

    const actorsArray = response.data?.data?.$values;

    if (Array.isArray(actorsArray) && actorsArray.length > 0) {
      setActors(actorsArray);
    } else {
      setActors([]);
      console.log("Nie znaleziono aktorów dla tego filmu");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        setActors([]);
        console.log("No actors found for this movie.");
      } else {
        setError("Błąd podczas wczytywania danych");
      }
    } else {
      setError("Nieoczekiwany błąd");
    }
    console.error(error);
  }
};


// Fetch movie reviews
export const fetchMovieReviews = async (movieId: string, setReviews: React.Dispatch<React.SetStateAction<any[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    const reviewsResponse = await axios.get(
      `https://localhost:7053/api/Reviews/by-movie-id/${movieId}`,
      {
        params: {
          pageNumber: 1,
          pageSize: 2,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,  // Dodanie nagłówka z tokenem
        },
      }
    );

    if (reviewsResponse.status === 200) {
      const reviewsData = reviewsResponse.data.data.$values;
      setReviews(reviewsData); 
    }
  } catch (reviewsError) {
    if (axios.isAxiosError(reviewsError) && reviewsError.response?.status === 404) {
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
    if (axios.isAxiosError(reviewsError) && reviewsError.response?.status === 404) {
      setReview(null); 
      console.log("Nie znaleznio recenzji dla tego filmu");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(reviewsError);
    }
  }
};


interface PaginationResponse {
  data: {
    $values: Movie[];
  };
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

interface FetchMoviesParams {
  pageNumber: number;
  pageSize: number;
  titleSearch?: string;
  orderBy?: string;
  sortDirection?: string;
  categoryNames?: string[];
  countryNames?: string[];
  actorsList?: string[];
  directorsList?: string[];
}

// Zwraca listę filmów
export const fetchMoviesByFilters = async (
  params: FetchMoviesParams
): Promise<PaginationResponse> => {
  try {
    const response = await axios.get<PaginationResponse>(
      "https://localhost:7053/api/Movies/by-filters",
      {
        params,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const fetchMoviesListByIds = async (
  pageNumber: number,
  pageSize: number,
  moviesIds: string[] | null,
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
): Promise<void> => {
  try {
    const params: any = {
      pageNumber,
      pageSize,
    };

    // Dodaj movieIdList tylko jeśli istnieje i nie jest pusty
    if (moviesIds && moviesIds.length > 0) {
      params.movieIdList = moviesIds;
    }

    const response = await axios.get(
      "https://localhost:7053/api/movies/get-list-by-id",
      {
        params,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("Pobrane filmy:", response.data.data.$values);
    setMovies(response.data.data.$values);
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error; // Lepiej przekazać błąd wyżej
  }
};