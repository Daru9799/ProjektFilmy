import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import { isUserMod } from "../hooks/decodeJWT";
import { createReply, deleteReply, editReply, fetchRepliesByReviewId, fetchReplyCountsByReviewIds } from "../API/ReplyUniwersalAPI";
import PaginationModule from "../components/SharedModals/PaginationModule";
import AddReviewModal from "../components/review_components/AddReviewModal";
import { Reply } from "../models/Reply";
import ReplyCard from "../components/reply_components/ReplyCard";
import { Review } from "../models/Review";
import { fetchReviewData } from "../API/reviewApi";
import ReviewCard from "../components/review_components/ReviewCard";
import ReplyFormModal from "../components/reply_components/ReplyFormModal";

const ReviewsPage = () => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });

  const [review, setReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [replyToEdit, setReviewToEdit] = useState<Reply | null>(null);
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

  const handleDeleteReview = async (replyId: string) => {
    try {
      await deleteReply("Reply", replyId, setReplies);
      await fetchRepliesByReviewId(
        "Reply",
        reviewId,
        pagination.pageNumber,
        pagination.pageSize,
        setReplies,
        setPagination,
        setError
      );
    } catch (err) {
      console.error("Błąd podczas usuwania recenzji:", err);
    }
  };

  const handleEditReply = (reply: Reply) => {
    setReviewToEdit(reply);
    setShowModal(true);
  };

  const handleCreateReply = async(comment:string) =>{
    if (!review?.reviewId) return;
    await createReply("Reply", review.reviewId, comment, setReplies, setError);
    await fetchRepliesByReviewId(
      "Reply",
      reviewId,
      pagination.pageNumber,
      pagination.pageSize,
      setReplies,
      setPagination,
      setError
    );
  }

  const handleModalSave = async (replyText: string) => {
    try {
      if (replyToEdit) {
        await editReply(
          "Reply",
          replyToEdit.replyId,
          replyText,
          setReplies,
          setError
        );
      } else {
        await handleCreateReply(replyText);
      }
    } finally {
      setShowModal(false);
      setReviewToEdit(null);
    }
  };

  useEffect(() => {
    try {
        fetchRepliesByReviewId(
          "Reply",
          reviewId,
          pagination.pageNumber,
          pagination.pageSize,
          setReplies,
          setPagination,
          setError
        );
      fetchReviewData(reviewId, setReview, setError);
    } finally {
      setLoading(false);
    }
  }, [
    pagination.pageNumber,
    pagination.pageSize,
    reviewId,
  ]);

  if (loading) {
    return <div className="text-center">Ładowanie recenzji...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div className="container my-2">
      <div className="m-4">
        <h2 style={{ color: "white" }}>Recenzje filmu:</h2>
        <div style={{ marginTop: "2%" }}>
          {/* {review && <MovieListModule movieList={review ? [review] : []} />} */}
          {/* Tutaj wstawienie kafelka z recenzją */}
          {review && <ReviewCard review={review} />}
        </div>
      </div>
      <div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Dodaj odpowiedź
        </button>
      </div>

      {replies.length > 0 ? (
        replies.map((reply) => (
          <ReplyCard
            key={reply.replyId}
            reply={reply}
            onDelete={() => handleDeleteReview(reply.replyId)}
            onEdit={() => handleEditReply(reply)}
            isLoggedUserMod={isLoggedUserMod}
          />
        ))
      ) : (
        <p>Brak komentarzy dla tej recenzji.</p>
      )}

      {/* Komponent paginacji */}
      {replies.length > 0 && (
        <PaginationModule
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      )}

      <ReplyFormModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setReviewToEdit(null); // Resetuj edycję przy zamknięciu
        }}
        onAddReview={handleModalSave}
        initialReviewText={replyToEdit?.comment} // Optional chaining
      />
    </div>
  );
};

export default ReviewsPage;
