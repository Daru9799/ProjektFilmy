import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Review } from "../../models/Review";
import SortReviewModule from "../review_components/SortReviewsModle"; 
import ReviewCard from "../review_components/ReviewCard"; 
import { useParams, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AddReviewModal from "../review_components/AddReviewModal"; 
import { useDeleteReview, useEditReview } from "../../API/ReviewApi";
import PaginationModule from "../SharedModals/PaginationModule";
import { isUserMod } from "../../hooks/decodeJWT";
import ActionPendingModal from "../SharedModals/ActionPendingModal";
import { useUserReviews } from "../../API/UserApi";
import SpinnerLoader from "../SpinnerLoader";
import { toast } from "react-toastify";
import { getApiError } from "../../functions/getApiError";

const ReviewsPage = () => {
  const { userName } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const [sortOrder, setSortOrder] = useState<string>("rating"); // Domyślnie sortowanie po ocenie
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [showModal, setShowModal] = useState(false); 
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null); 
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const navigate = useNavigate();

  //Api hooks
  const { data: reviewData, isLoading: reviewLoading, error: reviewsError} = useUserReviews(userName, pagination.pageNumber, 5, sortOrder, sortDirection);
  const reviews = reviewData?.reviews ?? [];
  const totalPages = reviewData?.totalPages ?? 1;
  //Mutacje
  const { mutate: deleteReview, isPending: isDeletingReview } = useDeleteReview();
  const { mutate: editReview, isPending: isEditingReview } = useEditReview();

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    deleteReview(reviewId, {
      onSuccess: () => {
        toast.success("Recenzja została usunięta pomyślnie!");
      },
      onError: (err) => {
        const apiErr = getApiError(err);
        toast.error(`Nie udało się usunąć recenzji. [${apiErr?.statusCode}] ${apiErr?.message}`);
      },
    });
  };
    
  const handleSortChange = (category: string) => {
    switch (category) {
      case "highRaiting":
        setSortOrder("rating");
        setSortDirection("desc");
        break;
      case "lowRaiting":
        setSortOrder("rating");
        setSortDirection("asc");
        break;
      case "new":
        setSortOrder("year");
        setSortDirection("desc");
        break;
      case "old":
        setSortOrder("year");
        setSortDirection("asc");
        break;
      default:
        break;
    }
  };

  const handleEditReview = (review: Review) => {
    setReviewToEdit(review); 
    setShowModal(true); 
  };

  const handleModalSave = (reviewText: string, rating: number) => {
    if (reviewToEdit) {
      editReview({
        reviewId: reviewToEdit.reviewId,
        updatedReview: { comment: reviewText, rating },
      }, {
        onSuccess: () => {
          setShowModal(false);
          setReviewToEdit(null);
          toast.success("Recenzja została zaktualizowana pomyślnie!");
        },
        onError: (err) => {
          const apiErr = getApiError(err);
          toast.error(`Nie udało się zaktualizować recenzji. [${apiErr?.statusCode}] ${apiErr?.message}`);
        },
      });
    }
  };

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  const renderTooltip = (props: any) => (
    <Tooltip {...props}>Powrót do profilu</Tooltip> // Treść dymka tooltipa
  );

  return (
    <div className="container my-4" style={{minHeight:"90vh"}}>
      <h2 className="mb-4" style={{ color: "white" }}>
        Wszystkie recenzje użytkownika {userName}:
      </h2>

      {/* Komponent sortowania */}
      <SortReviewModule onSort={handleSortChange} />

      <OverlayTrigger
        placement="top" // Pozycja dymka (można zmienić na "bottom", "right", "left")
        overlay={renderTooltip}
      >
        <button
          className="btn btn-secondary mb-3"
          onClick={() => navigate(`/user/${userName}`)}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      </OverlayTrigger>

      {reviewLoading ? (
        <SpinnerLoader />
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard
            key={review.reviewId}
            review={review}
            userPage={true}
            onDelete={() => handleDeleteReview(review.reviewId)}
            onEdit={() => handleEditReview(review)}
            isLoggedUserMod={isLoggedUserMod}
          />
        ))
      ) : (
        <p style={{ color: "white" }}>Brak recenzji</p>
      )}

      {/* Komponent paginacji */}
      <PaginationModule
        currentPage={pagination.pageNumber}
        totalPages={totalPages}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, pageNumber: page }))
        }
      />

      {/* Edycja*/}
      {reviewToEdit && (
        <AddReviewModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onAddReview={handleModalSave}
          initialReviewText={reviewToEdit.comment}
          initialReviewRating={reviewToEdit.rating} 
          headerText={"Edytuj recenzję"} 
          buttonText={"Zapisz zmiany"}          
        />
      )}

      <ActionPendingModal show={isDeletingReview} message="Trwa usuwanie recenzji..."/>
      <ActionPendingModal show={isEditingReview} message="Trwa zapisywanie recenzji..."/>
    </div>
  );
};

export default ReviewsPage;

