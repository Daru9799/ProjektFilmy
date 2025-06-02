import axios from "axios";

export const fetchRelationsData = async (username: string, setRelations: React.Dispatch<React.SetStateAction<any>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    const relationsResponse = await axios.get(`https://localhost:7053/api/UserRelations/by-username/${username}`);
    setRelations(relationsResponse.data);
  } catch (relationsError) {
    if (axios.isAxiosError(relationsError)) {
      if (relationsError.response?.status === 404) {
        setError("Nie znaleziono filmu");
      } else {
        setError("Błąd podczas wczytywaina danych");
      }
    } else {
      setError("Nieoczekiwany błąd");
    }
    console.error(relationsError);
  }
};

export const deleteRelation = async (relationId: string, setRelations: React.Dispatch<React.SetStateAction<any>>, setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    await axios.delete(
      `https://localhost:7053/api/UserRelations/delete-relation/${relationId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setRelations((prevRelations: any) => {
      const updatedRelations = { ...prevRelations };
      updatedRelations.$values = updatedRelations.$values.filter((relation: any) => relation.id !== relationId);
      return updatedRelations;
    });
  } catch (err) {
    console.error("Błąd podczas usuwania relacji:", err);
    setError("Nie udało się usunąć relacji. Spróbuj ponownie.");
  }
};