import { keepPreviousData, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useApiQuery } from "../hooks/useApiQuery";
import { API_BASE_URL } from "../constants/api";
import { useApiMutation } from "../hooks/useApiMutation ";

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

export const useDeleteRelation = () => {
  const queryClient = useQueryClient();
  return useApiMutation({
    mutationFn: async (relationId: string) => {
      await axios.delete(`${API_BASE_URL}/UserRelations/delete-relation/${relationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return relationId;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['userRelations'] });
      await queryClient.invalidateQueries({ queryKey: ['userData'] });
      await queryClient.invalidateQueries({ queryKey: ["isInvitedByUser"] });
    },
  });
};

export const useCreateRelation = () => {
  const queryClient = useQueryClient();
  return useApiMutation({
    mutationFn: async (params: { firstUserId: string; secondUserId: string; type: number }) => {
      const { firstUserId, secondUserId, type } = params;
      const { data } = await axios.post(`${API_BASE_URL}/UserRelations/add-relation`,
        { firstUserId, secondUserId, type }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userRelations"] });
      await queryClient.invalidateQueries({ queryKey: ['userData'] });
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};