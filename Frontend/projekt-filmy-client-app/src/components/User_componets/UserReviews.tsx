// import React, { useEffect, useState } from "react";
// import axios, { AxiosResponse } from "axios"; 
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Review } from "../../models/Review";
// import PaginationModule from "../PaginationModule";
// import SortReviewModule from "../review_components/SortReviewsModle"; // Import nowego komponentu
// import ReviewCard from "../review_components/ReviewCard"; // Import ReviewCard
// import { useParams, useNavigate } from "react-router-dom";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import { deleteReview } from "../../functions/ReloadFunctions";

// const ReviewsPage = () => {
//   const { userName } = useParams(); //username z URL
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [pagination, setPagination] = useState({
//     totalItems: 1,
//     pageNumber: 1,
//     pageSize: 5,
//     totalPages: 1,
//   });
//   const [sortOrder, setSortOrder] = useState<string>("rating"); // Domyślnie sortowanie po ocenie
//   const [sortDirection, setSortDirection] = useState<string>("desc");
//   const navigate = useNavigate();

//   const fetchReviewsByMovieId = async (page: number, pageS: number, sortOrder: string, sortDirection: string) => {
//     try {
//       const response: AxiosResponse<{
//         data: { $values: Review[] };
//         totalItems: number;
//         pageNumber: number;
//         pageSize: number;
//         totalPages: number;
//       }> = await axios.get(
//         `https://localhost:7053/api/Reviews/by-username/${userName}`,
//         {
//           params: {
//             pageNumber: page,
//             pageSize: pageS,
//             orderBy: sortOrder,
//             sortDirection: sortDirection,
//           },
//         }
//       );
  
//       const { data, totalItems, pageNumber, pageSize, totalPages } = response.data;

//       if (data && data.$values) {
//         setReviews(data.$values);
//       } else {
//         setReviews([]);
//       }
  
//       setPagination({ totalItems, pageNumber, pageSize, totalPages });
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         if (err.response?.status === 404) {
//           setReviews([]); // Handle no reviews case
//         } else {
//           setError("Wystąpił błąd podczas pobierania recenzji.");
//         }
//       } else {
//         setError("Nieoczekiwany błąd.");
//       }
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviewsByMovieId(pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection);
//   }, [pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection]);


//   const handleDeleteReview = (reviewId: string) => {
//     deleteReview(reviewId, setReviews);
//     fetchReviewsByMovieId(pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection);
//   };

//   const handleSortChange = (category: string) => {
//     switch (category) {
//       case "highRaiting":
//         setSortOrder("rating");
//         setSortDirection("desc");
//         break;
//       case "lowRaiting":
//         setSortOrder("rating");
//         setSortDirection("asc");
//         break;
//       case "new":
//         setSortOrder("year");
//         setSortDirection("desc");
//         break;
//       case "old":
//         setSortOrder("year");
//         setSortDirection("asc");
//         break;
//       default:
//         break;
//     }
//   };

//   if (loading) {
//     return <div className="text-center">Ładowanie recenzji...</div>;
//   }

//   if (error) {
//     return <div className="text-danger text-center">{error}</div>;
//   }
//   const renderTooltip = (props: any) => (
//     <Tooltip {...props}>Powrót do profilu</Tooltip> // Treść dymka tooltipa
//   );

//   return (
//     <div className="container my-4">
//       <h2 className="mb-4" style={{ color: "white" }}>
//         Wszystkie recenzje użytkownika {userName}:
//       </h2>

//       {/* Komponent sortowania */}
//       <SortReviewModule onSort={handleSortChange} />

//       <OverlayTrigger
//         placement="top" // Pozycja dymka (można zmienić na "bottom", "right", "left")
//         overlay={renderTooltip}
//       >
//         <button
//           className="btn btn-secondary mb-3"
//           onClick={() => navigate(`/user/${userName}`)}
//         >
//           <i className="fas fa-arrow-left"></i>
//         </button>
//       </OverlayTrigger>

//       {reviews.length > 0 ? (
//         reviews.map((review) => (
//           <ReviewCard
//             key={review.reviewId}
//             review={review}
//             showMovieTitle={true}
//             onDelete={() => handleDeleteReview(review.reviewId)}
//           />
//         ))
//       ) : (
//         <p style={{color:"white"}}>Brak recenzji</p>
//       )}

//       {/* Komponent paginacji */}
//       <PaginationModule
//         currentPage={pagination.pageNumber}
//         totalPages={pagination.totalPages}
//         onPageChange={(page) =>
//           setPagination((prev) => ({ ...prev, pageNumber: page }))
//         }
//       />
//     </div>
//   );
// };
// export default ReviewsPage;
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { Review } from "../../models/Review";
import PaginationModule from "../PaginationModule";
import SortReviewModule from "../review_components/SortReviewsModle"; // Import nowego komponentu
import ReviewCard from "../review_components/ReviewCard"; // Import ReviewCard
import { useParams, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { deleteReview, editReview } from "../../functions/ReloadFunctions"; // Import editReview
import AddReviewModal from "../review_components/AddReviewPanel"; // Import the AddReviewModal

const ReviewsPage = () => {
  const { userName } = useParams(); //username z URL
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
  const [showModal, setShowModal] = useState(false); // State to handle modal visibility
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null); // Store the review being edited
  const navigate = useNavigate();

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
          setReviews([]); // Handle no reviews case
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

  const handleDeleteReview = (reviewId: string) => {
    deleteReview(reviewId, setReviews);
    fetchReviewsByMovieId(pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection);
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
    <div className="container my-4">
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
            showMovieTitle={true}
            onDelete={() => handleDeleteReview(review.reviewId)}
            onEdit={() => handleEditReview(review)} // Add edit handler
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

      {/* Modal for editing a review */}
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

