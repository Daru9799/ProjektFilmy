import axios from "axios";
import { Review } from "../models/Review";

export const fetchCollectionReviewData = async (
  reviewId: string | undefined,
  setReview: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await axios.get(
      `https://localhost:7053/api/MovieCollectionReviews/${reviewId}`
    );
    setReview(response.data);
    console.log(response.data);
  } catch (err) {
    setError("Failed to fetch collection review data");
    console.error(err);
  }
};
