import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import { isUserMod } from "../hooks/decodeJWT";
import {
  createReply,
  deleteReply,
  editReply,
  fetchRepliesByReviewId,
} from "../API/ReplyUniwersalAPI";
import PaginationModule from "../components/SharedModals/PaginationModule";
import { Reply } from "../models/Reply";
import ReplyCard from "../components/reply_components/ReplyCard";
import { Review } from "../models/Review";
import ReviewCard from "../components/review_components/ReviewCard";
import ReplyFormModal from "../components/reply_components/ReplyFormModal";
import { ReplyEndpointType } from "../API/ReplyUniwersalAPI";
import { fetchCollectionReviewData } from "../API/CollectionReviewAPI";
import { fetchReviewData } from "../API/reviewApi";

interface ReviewRepliesPageProps {
  endpointPrefix: ReplyEndpointType;
}

const ReviewRepliesPage = ({ endpointPrefix }: ReviewRepliesPageProps) => {
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

  const handleDeleteReply = async (replyId: string) => {
    try {
      await deleteReply(endpointPrefix, replyId, setReplies);
      await fetchRepliesByReviewId(
        endpointPrefix,
        reviewId,
        pagination.pageNumber,
        pagination.pageSize,
        setReplies,
        setPagination,
        setError
      );
    } catch (err) {
      console.error("Błąd podczas usuwania odpowiedzi:", err);
    }
  };

  const handleEditReply = (reply: Reply) => {
    setReviewToEdit(reply);
    setShowModal(true);
  };

  const handleCreateReply = async (comment: string) => {
    //if (reviewId) return;
    await createReply(
      endpointPrefix,
      reviewId,
      comment,
      setReplies,
      setError
    );
    await fetchRepliesByReviewId(
      endpointPrefix,
      reviewId,
      pagination.pageNumber,
      pagination.pageSize,
      setReplies,
      setPagination,
      setError
    );
  };

  const handleModalSave = async (replyText: string) => {
    try {
      if (replyToEdit) {
        await editReply(
          endpointPrefix,
          replyToEdit.replyId,
          replyText,
          setReplies,
          setError
        );
        console.log("Zapisuję edycje reply:", replyText, "dla endpointu:", endpointPrefix);
      } else {
        await handleCreateReply(replyText);
        console.log("Zapisuję reply:", replyText, "dla endpointu:", endpointPrefix);
      }
    } finally {
      setShowModal(false);
      setReviewToEdit(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchRepliesByReviewId(
          endpointPrefix,
          reviewId,
          pagination.pageNumber,
          pagination.pageSize,
          setReplies,
          setPagination,
          setError
        );

        if (endpointPrefix === "Reply") {
          await fetchReviewData(reviewId, setReview, setError);
        } else {
          await fetchCollectionReviewData(reviewId, setReview, setError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagination.pageNumber, pagination.pageSize, reviewId, endpointPrefix]);

  if (loading) {
    return <div className="text-center">Ładowanie komentarzy..</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div className="container my-2">
      <div className="m-4">
        <h2 style={{ color: "white" }}>
          {endpointPrefix === "Reply"
            ? "Recenzja filmu:"
            : "Recenzja kolekcji:"}
        </h2>
        <div style={{ marginTop: "2%" }}>
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
            onDelete={() => handleDeleteReply(reply.replyId)}
            onEdit={() => handleEditReply(reply)}
            isLoggedUserMod={isLoggedUserMod}
          />
        ))
      ) : (
        <p>Brak komentarzy dla tej recenzji.</p>
      )}

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
          setReviewToEdit(null);
        }}
        onAddReview={handleModalSave}
        initialReviewText={replyToEdit?.comment}
      />
    </div>
  );
};

export default ReviewRepliesPage;

