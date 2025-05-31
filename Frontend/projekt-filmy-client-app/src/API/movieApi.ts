import axios from "axios";

// Fetch movie data
export const fetchMovieData = async (movieId: string, setMovie: React.Dispatch<React.SetStateAction<any>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
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

// Fetch actors data   -- !!!!!  DO ZMIANY
export const fetchActorsData = async (movieId: string, setActors: React.Dispatch<React.SetStateAction<any[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    const actorsResponse = await axios.get(`https://localhost:7053/api/Actors/by-movie-id/${movieId}`);
    if (actorsResponse.data?.$values) {
      setActors(actorsResponse.data.$values);
    } else {
      setActors([]); 
      console.log("Nie znaleziono aktorów dla tego filmu");
    }
  } catch (actorsError) {
    if (axios.isAxiosError(actorsError)) {
      if (actorsError.response?.status === 404) {
        setActors([]); // Jak nie pobrało to lista pusta
        console.log("No actors found for this movie.");
      } else {
        setError("Błąd podczas wczytywaina danych");
      }
    } else {
      setError("Nieoczekiwany błąd");
    }
    console.error(actorsError);
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