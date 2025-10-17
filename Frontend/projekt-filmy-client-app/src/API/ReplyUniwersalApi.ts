import axios from "axios";
import qs from "qs";
import { Reply } from "../models/Reply";

export type ReplyEndpointType = "Reply" | "MovieCollectionReviewReplies";

const getEndpointUrl = (endpointPrefix: ReplyEndpointType, path: string) => {
  return `https://localhost:7053/api/${endpointPrefix}/${path}`;
};

// Wspólna funkcja do obsługi błędów
const handleApiError = (
  error: unknown,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 400) {
      setError("Nieprawidłowe dane: " + error.response.data?.message);
    } else if (error.response?.status === 401) {
      setError("Nieautoryzowany dostęp - zaloguj się ponownie");
    } else if (error.response?.status === 403) {
      setError("Brak uprawnień do tej operacji");
    } else {
      setError(
        error.response
          ? `${error.response.status} - ${error.response.statusText}`
          : "Błąd sieci"
      );
    }
  } else {
    setError("Nieoczekiwany błąd");
  }
};

export const fetchReplyCountsByReviewIds = async (
  endpointPrefix: ReplyEndpointType,
  reviewIds: string[] | undefined,
  setReplyCounts: React.Dispatch<React.SetStateAction<number[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    if (!reviewIds || reviewIds.length === 0) {
      setReplyCounts([]);
      return;
    }

    const response = await axios.get<{
      $id: string;
      $values: number[];
    }>(getEndpointUrl(endpointPrefix, "total-amount-by-review-ids"), {
      params: { reviewsIds: reviewIds },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data?.$values?.length > 0) {
      setReplyCounts(response.data.$values);
    } else {
      setError("Brak danych o odpowiedziach");
      setReplyCounts([]);
    }
  } catch (err) {
    handleApiError(err, setError);
    setReplyCounts([]);
  }
};

export const createReply = async (
  endpointPrefix: ReplyEndpointType,
  reviewId: string | undefined,
  comment: string,
  setReplies: React.Dispatch<React.SetStateAction<Reply[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.post(
      getEndpointUrl(endpointPrefix, "add-review-reply"),
      {
        comment: comment,
        reviewId: reviewId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data) {
      setReplies((prev) => [...prev, response.data]);
    }
    console.log("Stworzono Reply")
    console.log(response.data)
  } catch (err) {
    handleApiError(err, setError);
    console.error("Błąd dodawania odpowiedzi:", err);
    throw err;
  }
};

export const deleteReply = async (
  endpointPrefix: ReplyEndpointType,
  replyId: string,
  setReplies: React.Dispatch<React.SetStateAction<Reply[]>>,
  setError?: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    await axios.delete(
      getEndpointUrl(endpointPrefix, `delete-review-reply/${replyId}`),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setReplies((prevReplies) =>
      prevReplies.filter((reply) => reply.replyId !== replyId)
    );
  } catch (err) {
    if (setError) handleApiError(err, setError);
    console.error("Błąd podczas usuwania odpowiedzi:", err);
  }
};

export const editReply = async (
  endpointPrefix: ReplyEndpointType,
  replyId: string,
  updatedComment: string,
  setReplies: React.Dispatch<React.SetStateAction<Reply[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.put(
      getEndpointUrl(endpointPrefix, `edit-review-reply/${replyId}`),
      { Comment: updatedComment },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply.replyId === replyId
            ? { ...reply, comment: updatedComment }
            : reply
        )
      );
    }
  } catch (err) {
    handleApiError(err, setError);
    console.error(err);
  }
};

export const fetchRepliesByReviewId = async (
  endpointPrefix: ReplyEndpointType,
  reviewId: string | undefined,
  page: number,
  pageS: number,
  setReplies: React.Dispatch<React.SetStateAction<Reply[]>>,
  setPagination: React.Dispatch<
    React.SetStateAction<{
      totalItems: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>
  >,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const reviewResponse = await axios.get(
      getEndpointUrl(endpointPrefix, `by-review-id/${reviewId}`),
      {
        params: {
          pageNumber: page,
          pageSize: pageS,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const { data, totalItems, pageNumber, pageSize, totalPages } =
      reviewResponse.data;
    setReplies(data.$values);
    setPagination({ totalItems, pageNumber, pageSize, totalPages });
  } catch (err) {
    handleApiError(err, setError);
    setReplies([]);
  }
};
