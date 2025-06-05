import axios from "axios";

export const fetchRelationsData = async (username: string, setRelations: React.Dispatch<React.SetStateAction<any>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    const relationsResponse = await axios.get(`https://localhost:7053/api/UserRelations/by-username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setRelations(relationsResponse.data);
  } catch (relationsError) {
    if (axios.isAxiosError(relationsError)) {
      if (relationsError.response?.status === 404) {
        setError("Nie znaleziono relacji");
      } else if (relationsError.response?.status === 403) {
        const errorMessage = "Nie masz uprawnień do przeglądania listy tego użytkownika.";
        setError(errorMessage);
      } else {
        setError("Błąd podczas wczytywania danych");
      }
    } else {
      setError("Nieoczekiwany błąd");
    }
    console.error(relationsError);
  }
};

export const deleteFriendRelation = async (relationId: string, setRelations: React.Dispatch<React.SetStateAction<any>>, setError: React.Dispatch<React.SetStateAction<string | null>>
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

export const createFriendRelation = async (
  firstUserId: string,
  secondUserId: string,
  setRelations: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.post(
      `https://localhost:7053/api/UserRelations/add-relation`,
      {
        firstUserId,
        secondUserId,
        type: 0 //Friend to 0 w enumie
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Odśwież relacje po dodaniu nowej
    setRelations((prevRelations: any) => {
      const updated = { ...prevRelations };
      updated.$values = [...(updated?.$values || []), response.data];
      return updated;
    });
  } catch (err) {
    console.error("Błąd podczas tworzenia relacji:", err);
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("Nie udało się dodać relacji. Spróbuj ponownie.");
    }
  }
};