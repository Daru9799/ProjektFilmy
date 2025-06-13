import axios from "axios";
import qs from "qs";
import { Reply } from "../models/Reply";

export const fetchReplyCountsByReviewIds = async (
  reviewIds: string[] | undefined,
  setReplyCounts: React.Dispatch<React.SetStateAction<number[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    if (!reviewIds || reviewIds.length === 0) {
      setReplyCounts([]);
      return;
    }

    const response = await axios.get<
    {
      $id: string;
      $values: number[];
    }
    >("https://localhost:7053/api/Reply/total-amount-by-review-id", {
      params: { reviewsIds: reviewIds },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (
      response.data &&
      response.data.$values &&
      response.data.$values.length > 0
    ) {
      setReplyCounts(response.data.$values); // Teraz masz dostęp do $values
      console.log(response.data.$values);
    } else {
      setError("Brak danych o odpowiedziach");
      setReplyCounts([]);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      setError(
        err.response
          ? `${err.response.status} - ${err.response.statusText}`
          : "Błąd sieci"
      );
    } else {
      setError("Nieoczekiwany błąd");
    }
    setReplyCounts([]);
  }
};

// Delete user reply
export const deleteReply = async (
  replyId: string,
  setReplies: React.Dispatch<React.SetStateAction<Reply[]>>
) => {
  try {
    await axios.delete(
      `https://localhost:7053/api/Reply/delete-review-reply/${replyId}`,
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
    console.error("Błąd podczas usuwania recenzji:", err);
    alert("Nie udało się usunąć recenzji. Spróbuj ponownie.");
  }
};

export const fetchRepliesByReviewId = async (
  reviewId: string | undefined,
  page: number,
  pageS: number,
  setReviews: React.Dispatch<React.SetStateAction<Reply[]>>,
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
      `https://localhost:7053/api/Reply/by-review-id/${reviewId}`,
      {
        params: {
          pageNumber: page,
          pageSize: pageS,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Dodanie nagłówka z tokenem
        },
      }
    );
    const { data, totalItems, pageNumber, pageSize, totalPages } =
      reviewResponse.data;
    setReviews(data.$values);
    setPagination({ totalItems, pageNumber, pageSize, totalPages });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      setError(
        err.response
          ? `${err.response.status} - ${err.response.statusText}`
          : "Błąd sieci."
      );
    } else {
      setError("Nieoczekiwany błąd.");
    }
  }
};