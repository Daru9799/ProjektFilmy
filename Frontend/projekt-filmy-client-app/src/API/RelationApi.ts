import { keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { useApiQuery } from "../hooks/useApiQuery";
import { API_BASE_URL } from "../constants/api";


export const useUserRelations = (username: string | undefined, type: string) => {
  return useApiQuery<{ relations: any[] } | null>({
    queryKey: ['userRelations', username, type],
    queryFn: async () => {
        const { data } = await axios.get(`${API_BASE_URL}/UserRelations/by-username/${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: { type },
          }
        );
        return { relations: data.$values ?? [] };
    },
    retry: false,
    placeholderData: keepPreviousData,
  });
};

/////////////////////////////////////////////////////////////////////////////////////////////

export const deleteRelation = async (
  relationId: string,
  setRelations: React.Dispatch<React.SetStateAction<any>>
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
    updatedRelations.$values = updatedRelations.$values.filter(
      (relation: any) => relation.id !== relationId
    );
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
        type,
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
