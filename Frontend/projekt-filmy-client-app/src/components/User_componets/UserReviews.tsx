import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { Review } from "../../models/Review";
import SortReviewModule from "../review_components/SortReviewsModle"; 
import ReviewCard from "../review_components/ReviewCard"; 
import { useParams, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AddReviewModal from "../review_components/AddReviewPanel"; 
import { deleteReview, editReview } from "../../API/reviewApi";
import PaginationModule from "../SharedModals/PaginationModule";
import { isUserMod } from "../../hooks/decodeJWT";

const ReviewsPage = () => {
  const { userName } = useParams(); 
  const [reviews, setReviews] = useState<Review[]>([]);
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

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

  const fetchReviewsByMovieId = async (page: number, pageS: number, sortOrder: string, sortDirection: string) => {
    try {
      const response: AxiosResponse<{
        data: { $values: Review[] };
        totalItems: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
      }> = await axios.get(
        `https://localhost:7053/api/Reviews/by-username/${userName}`,
        {
          params: {
            pageNumber: page,
            pageSize: pageS,
            orderBy: sortOrder,
            sortDirection: sortDirection,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,  // Dodanie nagłówka z tokenem
          },
        }
      );

      const { data, totalItems, pageNumber, pageSize, totalPages } = response.data;

      if (data && data.$values) {
        setReviews(data.$values);
      } else {
        setReviews([]);
      }

      setPagination({ totalItems, pageNumber, pageSize, totalPages });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setReviews([]); 
        } else {
          setError("Wystąpił błąd podczas pobierania recenzji.");
        }
      } else {
        setError("Nieoczekiwany błąd.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsByMovieId(pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection);
  }, [pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection]);


    const handleDeleteReview = async (reviewId: string) => {
      try {
    
        await deleteReview(reviewId, setReviews);
    
        fetchReviewsByMovieId(pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection);
      } catch (err) {
        console.error("Błąd podczas usuwania recenzji:", err);
      }
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
      editReview(
        reviewToEdit.reviewId,
        { comment: reviewText, rating },
        setReviews,
        setError
      );
      setShowModal(false); 
      setReviewToEdit(null); 
    }
  };

  if (loading) {
    return <div className="text-center">Ładowanie recenzji...</div>;
  }

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

      {reviews.length > 0 ? (
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
        totalPages={pagination.totalPages}
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
        />
      )}
    </div>
  );
};

export default ReviewsPage;

