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

// Fetch actors data
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

export const fetchUserData = async (
  userName: string,
  setUser: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(
      `https://localhost:7053/api/Users/by-username/${userName}`
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

// Fetch user reviews
export const fetchUserReviews = async (
  userName: string,
  pageSize: number,
  setReviews: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const reviewsResponse = await axios.get(
      `https://localhost:7053/api/Reviews/by-username/${userName}`,
      {
        params: {
          pageNumber: 1,
          pageSize, // Ustawienie rozmiaru strony z parametru
          orderBy: "desc",
          sortDirection: "year",
        },
      }
    );
    const { data } = reviewsResponse.data;
    if (data && data.$values) {
      setReviews(data.$values);
    } else {
      setReviews([]);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        setReviews([]);
      } else {
        setError("Wystąpił błąd podczas pobierania recenzji.");
      }
    }
    console.error(err);
  }
};

// Delete user review
export const deleteReview = async (
  reviewId: string,
  setReviews: React.Dispatch<React.SetStateAction<any[]>>
) => {
  try {
    await axios.delete(
      `https://localhost:7053/api/Reviews/delete-review/${reviewId}`
    );
    setReviews((prevReviews) => prevReviews.filter((review) => review.reviewId !== reviewId));
  } catch (err) {
    console.error("Błąd podczas usuwania recenzji:", err);
    alert("Nie udało się usunąć recenzji. Spróbuj ponownie.");
  }
};

export const editReview = async (
  reviewId: string,
  updatedReview: { comment: string; rating: number },
  setReviews: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.put(
      `https://localhost:7053/api/Reviews/edit-review/${reviewId}`,
      updatedReview
    );
    if (response.status === 200) {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.reviewId === reviewId ? { ...review, ...updatedReview } : review
        )
      );
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        setError("Nie udało się dodać modyfikacji");
      } else {
        setError("Wystąpił błąd podczas modyfikacji recenzji.");
      }
    }
    console.error(err);
  }
};



export const fetchDirectorMovies = async (directorId: string, setMovies: React.Dispatch<React.SetStateAction<any[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    const response = await axios.get(
      `https://localhost:7053/api/Movies/by-directorId/${directorId}`);

    if (response.status === 200) {
      const data = response.data.$values;
      setMovies(data); 
    }
  } catch (reviewsError) {
    if (axios.isAxiosError(reviewsError) && reviewsError.response?.status === 404) {
      setMovies([]); 
      console.log("Nie znaleznio filmów dla tego reżysera");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(reviewsError);
    }
  } finally {
    setLoading(false); 
  }
};


export const fetchActorMovies = async (actorId: string, setMovies: React.Dispatch<React.SetStateAction<any[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    const response = await axios.get(
      `https://localhost:7053/api/Movies/by-actorId/${actorId}`);

    if (response.status === 200) {
      const data = response.data.$values;
      setMovies(data); 
    }
  } catch (reviewsError) {
    if (axios.isAxiosError(reviewsError) && reviewsError.response?.status === 404) {
      setMovies([]); 
      console.log("Nie znaleznio filmów dla tego aktora");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(reviewsError);
    }
  } finally {
    setLoading(false); 
  }
};