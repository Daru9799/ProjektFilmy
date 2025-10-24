import PaginationModule from "../components/SharedModals/PaginationModule";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isUserMod } from "../hooks/decodeJWT";
import { useUserData } from "../API/UserApi";
import { useMovieCollectionsByUser } from "../API/MovieCollectionApi";
import MovieCollectionCard from "../components/MovieCollection_components/MovieCollectionCard";
import SpinnerLoader from "../components/SpinnerLoader";
import ApiErrorDisplay from "../components/ApiErrorDisplay";

const MovieCollectionByUserPage = () => {
  const loggedUserName = localStorage.getItem("logged_username") || "";
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const { userName } = useParams();
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //Potem mozna wymienić na stan, jesli bylaby implementacja sortowania
  const sortOrder = "likes";
  const sortDirection = "likes";

  //Api hooks:
  const { data: user, isLoading: userLoading, apiError: userError } = useUserData(userName);
  const { data: movieCollectionsData, isLoading: movieCollectionsLoading, apiError: movieCollectionsError } = useMovieCollectionsByUser(user?.id, pagination.pageNumber, pagination.pageSize, sortOrder, sortDirection);
  const movieCollections = movieCollectionsData?.collections ?? [];
  const totalPages = movieCollectionsData?.totalPages ?? 1;

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

  if(userLoading || movieCollectionsLoading) return <SpinnerLoader />
  if (userError) return <ApiErrorDisplay apiError={userError} />;

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <div className="mt-3">
        <PaginationModule
          currentPage={pagination.pageNumber}
          totalPages={totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </div>

      <h4 className=" ms-4" style={{ color: "white" }}>
        Kolekcje użytkownika {user?.userName}
      </h4>

      <ApiErrorDisplay apiError={movieCollectionsError}>
        {movieCollections.length > 0 ? (
          movieCollections.map((movieCollection) => (
            <div
              key={movieCollection.movieCollectionId}
              className="d-flex justify-content-center"
            >
              <MovieCollectionCard
                movieCollection={movieCollection}
                loggedUserName={loggedUserName}
                isLoggedUserMod={isLoggedUserMod}
                userPage={true}
                isFriend={false}
                setError={setError}
              />
            </div>
          ))
        ) : (
          <p className="text-center" style={{ color: "white" }}>
            Brak kolekcji do wyświetlenia.
          </p>
        )}
      </ApiErrorDisplay>

      <div className="mt-3">
        <PaginationModule
          currentPage={pagination.pageNumber}
          totalPages={totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </div>
    </div>
  );
};

export default MovieCollectionByUserPage;