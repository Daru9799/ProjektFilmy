// ReloadFunctions.ts

import axios from "axios";

// Fetch movie data
export const fetchMovieData = async (movieId: string, setMovie: React.Dispatch<React.SetStateAction<any>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    const movieResponse = await axios.get(`https://localhost:7053/api/Movies/${movieId}`);
    setMovie(movieResponse.data);
  } catch (movieError) {
    if (axios.isAxiosError(movieError)) {
      if (movieError.response?.status === 404) {
        setError("Movie data not found.");
      } else {
        setError("An error occurred while fetching movie data.");
      }
    } else {
      setError("Unknown error occurred while fetching movie.");
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
      setActors([]); // If no actors, set an empty array
      console.log("No actors found for this movie.");
    }
  } catch (actorsError) {
    if (axios.isAxiosError(actorsError)) {
      if (actorsError.response?.status === 404) {
        setActors([]); // No actors found
        console.log("No actors found for this movie.");
      } else {
        setError("An error occurred while fetching actors.");
      }
    } else {
      setError("Unknown error occurred while fetching actors.");
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
      setReviews([]); // No reviews found for this movie
      console.log("No reviews found for this movie.");
    } else {
      setError("Error fetching reviews.");
      console.error(reviewsError);
    }
  } finally {
    setLoading(false); // Ensure loading state is updated after the request
  }
};
