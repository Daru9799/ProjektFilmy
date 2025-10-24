import axios from "axios";
import qs from "qs";
import { Reply } from "../models/Reply";
import { keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "../constants/api";
import { useApiQuery } from "../hooks/useApiQuery";

export type ReplyEndpointType = "Reply" | "MovieCollectionReviewReplies";

export const useReplyCountsByReviewIds = (endpointPrefix: ReplyEndpointType, reviews: ({ reviewId?: string; movieCollectionReviewId?: string }[] | undefined)) => {
  return useApiQuery<Record<string, number>>({
    queryKey: ["replyCounts", endpointPrefix, reviews?.map(r => r.reviewId || r.movieCollectionReviewId)],
    queryFn: async () => {
      if (!reviews || reviews.length === 0) return {};
      //Wybranie odpowiedniego typu (ponieważ są różnice w obiektach jeśli chodzi o nazewnictwo klucza głównego)
      const reviewIds = reviews.map(r => r.reviewId || r.movieCollectionReviewId).filter(Boolean) as string[];

      const { data } = await axios.get(`${API_BASE_URL}/${endpointPrefix}/total-amount-by-review-ids`, {
        params: { reviewsIds: reviewIds },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
      });
      //Mapowanie { recenzja: liczba komentarzy }
      const countsMap: Record<string, number> = {};
      if (data?.$values?.length > 0) {
        reviewIds.forEach((id, idx) => {
          countsMap[id] = data.$values[idx] ?? 0;
        });
      }
      return countsMap;
    },
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useRepliesByReviewId = (endpointPrefix: ReplyEndpointType, reviewId: string | undefined, page: number, pageSize: number) => {
  return useApiQuery<{ replies: Reply[]; totalPages: number }>({
    queryKey: ["replies", endpointPrefix, reviewId, page, pageSize],
    queryFn: async () => {
      if (!reviewId) return { replies: [], totalPages: 1 };
      try {
        const { data } = await axios.get(`${API_BASE_URL}/${endpointPrefix}/by-review-id/${reviewId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              pageNumber: page,
              pageSize,
            },
          }
        );
        return {
          replies: data.data.$values ?? [],
          totalPages: data.totalPages ?? 1,
        };
      } catch (error) {
        //Pusta lista z odpowiedziami
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return { replies: [], totalPages: 1 };
        }
        throw error;
      }
    },
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export const useCreateReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ endpointPrefix, reviewId, comment }: { endpointPrefix: ReplyEndpointType; reviewId: string; comment: string }) => {
      const { data } = await axios.post(`${API_BASE_URL}/${endpointPrefix}/add-review-reply`, { 
          reviewId, 
          comment 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["replies"] });
      await queryClient.invalidateQueries({ queryKey: ["replyCounts"] });
    },
  });
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ endpointPrefix, replyId }: { endpointPrefix: ReplyEndpointType; replyId: string }) => {
      await axios.delete(`${API_BASE_URL}/${endpointPrefix}/delete-review-reply/${replyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return replyId;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["replies"] });
      await queryClient.invalidateQueries({ queryKey: ["replyCounts"] });
    },
  });
};

export const useEditReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ endpointPrefix, replyId, updatedComment }: { endpointPrefix: ReplyEndpointType; replyId: string; updatedComment: string }) => {
      const response = await axios.put(`${API_BASE_URL}/${endpointPrefix}/edit-review-reply/${replyId}`, { 
          Comment: updatedComment 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: async () => {
      //Odświeżenie listy odpowiedzi
      await queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
  });
};