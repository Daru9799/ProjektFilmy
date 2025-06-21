import axios from "axios";
import { MovieCollection } from "../models/MovieCollection";
import { MovieCollectionReview } from "../models/MovieCollectionReview";

export const createMovieCollection = async (
  collectionData: {
    title: string;
    description?: string;
    shareMode: number;
    type: number;
    allowCopy: boolean;
    movieIds?: string[];
  },
  onSuccess?: () => void,
  onError?: (error: any) => void
) => {
  try {
    await axios.post(
      "https://localhost:7053/api/MovieCollection/add-collection",
      collectionData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (onSuccess) onSuccess();
    alert("Pomyślnie utworzono kolekcję.");
  } catch (err) {
    console.error("Błąd podczas tworzenia kolekcji:", err);
    alert("Nie udało się utworzyć kolekcji. Spróbuj ponownie.");
    if (onError) onError(err);
  }
};

export const fetchMovieCollectionById = async (
  movieCollectionId: string | undefined,
  setMovieCollection: React.Dispatch<
    React.SetStateAction<MovieCollection | null>
  >,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.get(
      `https://localhost:7053/api/MovieCollection/${movieCollectionId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Dodanie nagłówka z tokenem
        },
      }
    );
    setMovieCollection(response.data);
    console.log(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        setError("Błąd sieci: nie można połączyć się z serwerem.");
      } else {
        setError(
          `Błąd: ${error.response.status} - ${error.response.statusText}`
        );
      }
    } else {
      setError("Wystąpił nieoczekiwany błąd.");
    }
    console.error(error);
  }
};

export const addMovieCollectionReview = async (
  review: string,
  rating: number,
  isSpoiler: boolean,
  userName: string,
  movieCollectionId: string | undefined
) => {
  if (!movieCollectionId) {
    console.log("Brak movieCollectionId");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("Brak tokenu");
    return;
  }

  await axios.post(
    "https://localhost:7053/api/MovieCollectionReviews/add-movie-collection-review",
    {
      Rating: rating,
      Comment: review,
      Date: new Date().toISOString(),
      MovieCollectionId: movieCollectionId,
      UserName: userName,
      Spoilers: isSpoiler,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  console.log("wysłano recenzję");
};

export const fetchMovieCollectionReviews = async (
  movieCollectionId: string | undefined,
  setReviews: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPagination: React.Dispatch<
    React.SetStateAction<{
      totalItems: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>
  >,
  sortOrder: string | null,
  sortDirection: string | null,
  page: number | null,
  pageS: number | null
) => {
  try {
    const reviewsResponse = await axios.get(
      `https://localhost:7053/api/MovieCollectionReviews/by-movie-collection-id/${movieCollectionId}`,
      {
        params: {
          pageNumber: page,
          pageSize: pageS,
          orderBy: sortOrder,
          sortDirection: sortDirection,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Dodanie nagłówka z tokenem
        },
      }
    );

    if (reviewsResponse.status === 200) {
      const { data, totalItems, pageNumber, pageSize, totalPages } =
        reviewsResponse.data;
      setReviews(data.$values);
      setPagination({ totalItems, pageNumber, pageSize, totalPages });
    }
  } catch (reviewsError) {
    if (
      axios.isAxiosError(reviewsError) &&
      reviewsError.response?.status === 404
    ) {
      setReviews([]);
      console.log("Nie znaleznio recenzji dla tej listy");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(reviewsError);
    }
  } finally {
    setLoading(false);
  }
};

export const fetchMovieCollectionsByUser = async (
  userId: string | undefined,
  page: number,
  pageS: number,
  sortOrder: string,
  sortDirection: string,
  setMovieCollection: React.Dispatch<React.SetStateAction<MovieCollection[]>>,
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
    const movieCollectionResponse = await axios.get(
      `https://localhost:7053/api/MovieCollection/by-user-id/${userId}`,
      {
        params: {
          pageNumber: page,
          pageSize: pageS,
          orderBy: sortOrder,
          sortDirection: sortDirection,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Dodanie nagłówka z tokenem
        },
      }
    );
    const { data, totalItems, pageNumber, pageSize, totalPages } =
      movieCollectionResponse.data;
    setMovieCollection(data.$values);
    setPagination({ totalItems, pageNumber, pageSize, totalPages });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      setError(
        err.response
          ? `${err.response.status} - ${err.response.statusText}`
          : "Błąd sieci."
      );
    } else {
      setError("Nieoczekiwany błąd.");
    }
  } finally {
    setLoading(false);
  }
};

export const fetchUserReviewForMC = async (
  userId: string,
  Id: string,
  setReview: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("Brak tokenu, użytkownik nie jest zalogowany.");
    return;
  }

  try {
    const response = await axios.get(
      `https://localhost:7053/api/MovieCollectionReviews/by-userid-and-moviecollection-id`,
      {
        params: {
          userId: userId,
          movieCollectionId: Id,
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
      console.log("Nie znaleznio recenzji użytkownika dla tej kolekcji");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(reviewsError);
    }
  }
};
