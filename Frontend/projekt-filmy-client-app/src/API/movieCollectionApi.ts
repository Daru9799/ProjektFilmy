import axios from "axios";

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
