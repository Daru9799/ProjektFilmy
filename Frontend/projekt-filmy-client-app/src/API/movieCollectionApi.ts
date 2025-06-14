import axios from "axios";
import { MovieCollection } from "../models/MovieCollection";

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
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean | null>>
) => {
  try {
    const response = await axios.get(
      `https://localhost:7053/api/MovieCollection/${movieCollectionId}`
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
  } finally {
    setLoading(false);
  }
};
