import MovieListModule from "../components/SearchMovies_componets/MovieListModule";
import { useMoviesByFilters } from "../API/movieApi";
import SpinnerLoader from "../components/SpinnerLoader";

const HomePage = () => {
  //Wyswietlenie pierwszych 3 filmow
  const { data, isLoading, error } = useMoviesByFilters(1, 3, "", "rating", "desc");
  const movies = data?.movies ?? [];

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{
          backgroundImage: "url('/imgs/cinema-background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          width: "100%",
        }}
        className="d-flex justify-content-center align-items-center"
      ></div>
      <div
        className="container-sm text-white py-3"
        style={{ backgroundColor: "#1A075A" }}
      >
        <h1 className="jersey-15-regular">WEBFILM</h1>
        <p>
          Witaj na stronie dzięki której będziesz mógł znaleść filmy do
          obejrzenia, wystawić im potem recenzje i sprawdzić recenzje innych
          użytkowników.
        </p>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center py-2">
        <h1 className="mb-3 text-white jersey-15-regular">Top 3 filmy:</h1>

      {isLoading ? (
        <SpinnerLoader />
      ) : (
        <MovieListModule movieList={movies} />
      )}
      
      </div>
    </div>
  );
};

export default HomePage;
