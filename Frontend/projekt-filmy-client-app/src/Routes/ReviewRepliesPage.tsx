import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import { isUserMod } from "../hooks/decodeJWT";
import { useRepliesByReviewId, useCreateReply, useDeleteReply, useEditReply } from "../API/ReplyUniwersalApi"
import PaginationModule from "../components/SharedModals/PaginationModule";
import { Reply } from "../models/Reply";
import ReplyCard from "../components/reply_components/ReplyCard";
import ReviewCard from "../components/review_components/ReviewCard";
import ReplyFormModal from "../components/reply_components/ReplyFormModal";
import { ReplyEndpointType } from "../API/ReplyUniwersalApi"
import { 
  useSendMovieReviewCommentedNotification, 
  useSendCollectionReviewCommentedNotification 
} from "../API/NotificationApi"
import { getLoggedUserId } from "../hooks/decodeJWT";
import { useReviewById } from "../API/ReviewApi";
import { useCollectionReviewById } from "../API/CollectionReviewApi";
import SpinnerLoader from "../components/SpinnerLoader";
import { Review } from "../models/Review";
import ActionPendingModal from "../components/SharedModals/ActionPendingModal";
import ApiErrorDisplay from "../components/ApiErrorDisplay";

interface ReviewRepliesPageProps {
  endpointPrefix: ReplyEndpointType;
}

const ReviewRepliesPage = ({ endpointPrefix }: ReviewRepliesPageProps) => {
  const { reviewId } = useParams<{ reviewId: string }>();
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });

  const [showModal, setShowModal] = useState(false);
  const [replyToEdit, setReviewToEdit] = useState<Reply | null>(null);
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);

  //API
  const { data: movieReview, isLoading: movieReviewLoading, apiError: movieReviewError } = useReviewById(reviewId);
  const { data: collectionReview, isLoading: collectionReviewLoading, apiError: collectionReviewError } = useCollectionReviewById(reviewId);
  const { data: repliesData, isLoading: repliesLoading, error: repliesError } = useRepliesByReviewId(endpointPrefix, reviewId, pagination.pageNumber, pagination.pageSize);
  const replies = repliesData?.replies ?? [];
  const totalReplyPages = repliesData?.totalPages ?? 1;
  //Mutacje
  const { mutate: createReply, isPending: isCreatingReply, error: createReplyError } = useCreateReply();
  const { mutate: deleteReply, isPending: isDeletingReply, error: deleteReplyError } = useDeleteReply();
  const { mutate: editReply, isPending: isEditingReply, error: editReplyError } = useEditReply();
  const { mutate: sendReviewCommentedNotification } = useSendMovieReviewCommentedNotification();
  const { mutate: sendCollectionReviewCommentedNotification } = useSendCollectionReviewCommentedNotification();
  
  let review: Review | undefined;
  let reviewLoading : boolean;
  let reviewError: any;
  if (endpointPrefix === "Reply") {
    review = movieReview
    reviewLoading = movieReviewLoading
    reviewError = movieReviewError
  } else {
    review = collectionReview
    reviewLoading = collectionReviewLoading
    reviewError = collectionReviewError
  }

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

  const handleDeleteReply = async (replyId: string) => {
    deleteReply({ endpointPrefix, replyId });
  };

  const handleEditReply = (reply: Reply) => {
    setReviewToEdit(reply);
    setShowModal(true);
  };

  const handleCreateReply = async (comment: string) => {
    if (!reviewId || !review) return;
    createReply({ endpointPrefix, reviewId, comment });

    //Generowanie powiadomienia
    const reviewAuthorId = review.userId;
    const loggedUserId = getLoggedUserId(); //Id użytkownika, który dodaje komentarz
    const loggedUserName = localStorage.getItem("logged_username");

    if (loggedUserId && loggedUserId !== reviewAuthorId) {
    if (endpointPrefix === "Reply") {
      sendReviewCommentedNotification({ reviewId: reviewId, targetUserId: reviewAuthorId, sourceUserId: loggedUserId, sourceUserName: loggedUserName })
    } else {
        sendCollectionReviewCommentedNotification({ collectionId: reviewId, targetUserId: reviewAuthorId, sourceUserId: loggedUserId, sourceUserName: loggedUserName});
      }
    }
  };

  const handleModalSave = async (replyText: string) => {
    try {
    if (replyToEdit) {
      editReply({ endpointPrefix, replyId: replyToEdit.replyId, updatedComment: replyText });
    } else {
      await handleCreateReply(replyText); //leci async bo powiadomienia jeszcze nieprzerobione na react query
    }
    } finally {
      setShowModal(false);
      setReviewToEdit(null);
    }
  };

  return (
    <div className="container my-2" style={{ minHeight: "90vh"}}>
      <div className="m-4">
        <h2 style={{ color: "white" }}>
          {endpointPrefix === "Reply"
            ? "Recenzja filmu:"
            : "Recenzja kolekcji:"}
        </h2>
        <div style={{ marginTop: "2%" }}>
        <ApiErrorDisplay apiError={reviewError}>
          {reviewLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
              <SpinnerLoader />
            </div>
          ) : review ? (
            <ReviewCard review={review} />
          ) : (
            <p className="text-light text-center">Nie znaleziono recenzji.</p>
          )}
        </ApiErrorDisplay>
        </div>
      </div>
      <div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Dodaj odpowiedź
        </button>
      </div>

      {repliesLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
          <SpinnerLoader />
        </div>
      ) : replies.length > 0 ? (
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
        <p style={{ color: "white" }}>Brak komentarzy dla tej recenzji.</p>
      )}

      {replies.length > 0 && (
        <PaginationModule
          currentPage={pagination.pageNumber}
          totalPages={totalReplyPages}
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
        onAddReply={handleModalSave}
        initialReplyText={replyToEdit?.comment || ""}
        headerText={replyToEdit ? "Edytuj komentarz" : "Dodaj komentarz"}
        buttonText={replyToEdit ? "Zapisz zmiany" : "Dodaj"}
      />
      <ActionPendingModal show={isCreatingReply} message="Trwa dodawanie odpowiedzi..."/>
      <ActionPendingModal show={isDeletingReply} message="Trwa usuwanie odpowiedzi..."/>
      <ActionPendingModal show={isEditingReply} message="Trwa edycja odpowiedzi..."/>
    </div>
  );
};

export default ReviewRepliesPage;