import { JSX } from "react/jsx-runtime";

// Funkcja do generowania gwiazdek
export const renderStars = (rating: number): JSX.Element => {
  const fullStars = Math.floor(rating); // Całkowite gwiazdki
  const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Pół gwiazdki
  const emptyStars = 5 - fullStars - halfStars; // Puste gwiazdki

  let stars = [];

  // Dodaj pełne gwiazdki
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <i key={`full-${i}`} className="fas fa-star" style={{ color: "#FFD700" }}></i>
    );
  }

  // Dodaj pół gwiazdki
  if (halfStars) {
    stars.push(
      <i key="half" className="fas fa-star-half-alt" style={{ color: "#FFD700" }}></i>
    );
  }

  // Dodaj puste gwiazdki
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <i key={`empty-${i}`} className="far fa-star" style={{ color: "#FFD700" }}></i>
    );
  }

  return (
    <div>
      {stars}
      {/* <p>{rating.toFixed(1)} / 5</p>  */}
    </div>
  );
};
