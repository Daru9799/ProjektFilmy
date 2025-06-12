import axios from "axios";

export const fetchRelationsData = async (username: string, type: string, setRelations: React.Dispatch<React.SetStateAction<any>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
  try {
    const relationsResponse = await axios.get(`https://localhost:7053/api/UserRelations/by-username/${username}`, {
      params: {
        type: type
        },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setRelations(relationsResponse.data);
  } catch (relationsError) {
    if (axios.isAxiosError(relationsError)) {
      if (relationsError.response?.status === 404) {
        return;
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

export const deleteRelation = async (relationId: string, setRelations: React.Dispatch<React.SetStateAction<any>>
) => {
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
};

export const createRelation = async (
  firstUserId: string,
  secondUserId: string,
  type: number, //0 - Friend 1 - Blocked
  setRelations: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.post(
      `https://localhost:7053/api/UserRelations/add-relation`,
      {
        firstUserId,
        secondUserId,
        type
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

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