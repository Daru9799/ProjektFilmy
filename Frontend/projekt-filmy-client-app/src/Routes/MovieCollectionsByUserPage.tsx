import PaginationModule from "../components/SharedModals/PaginationModule";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserProfile } from "../models/UserProfile";
import { isUserMod } from "../hooks/decodeJWT";
import { fetchUserData } from "../API/userAPI";
import { fetchMovieCollectionsByUser } from "../API/movieCollectionApi";
import { MovieCollection } from "../models/MovieCollection";
import { Card } from "react-bootstrap";
import MovieCollectionCard from "../components/MovieCollection_components/MovieCollectionCard";
import { fetchRelationsData } from "../API/relationApi";

const MovieCollectionByUserPage = () => {
  const loggedUserName = localStorage.getItem("logged_username") || "";
  const [pagination, setPagination] = useState({
    totalItems: 1,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 1,
  });
  const [user, setUser] = useState<UserProfile>();
  const { userName } = useParams();
  const [isLoggedUserMod, setIsLoggedUserMod] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fakeLoading, fakeSetLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<string>("likes");
  const [sortDirection, setSortDirection] = useState<string>("likes");
  const [movieCollections, setMovieCollections] = useState<MovieCollection[]>(
    []
  );
  const [relations, setRelations] = useState<any>(null);
  const placeholder = () => {};
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedUserMod(isUserMod());
  }, []);

  useEffect(() => {
    fetchUserData(userName, setUser, setError, fakeSetLoading, placeholder);
  }, [userName]);

  useEffect(() => {
    if (user?.id) {
      fetchRelationsData(
        localStorage.getItem("logged_username")!,
        "",
        setRelations,
        setError,
        navigate
      );
      fetchMovieCollectionsByUser(
        user.id,
        pagination.pageNumber,
        pagination.pageSize,
        sortOrder,
        sortDirection,
        setMovieCollections,
        setPagination,
        setError,
        setLoading
      );
    }
  }, [user, pagination.pageNumber, pagination.pageSize]);

  const isFriend = relations?.$values.some(
    (relation: any) =>
      relation.type === "Friend" && relation.relatedUserName === user?.userName
  );
  const isBlocked = relations?.$values.some(
    (relation: any) =>
      relation.type === "Blocked" && relation.relatedUserName === user?.userName
  );

  if (isBlocked) {
    navigate("/"); //W przypadku bloka przenosi na /
    return null;
  }

  if (loading) return <p>Ładowanie danych...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <div className="mt-3">
        <PaginationModule
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </div>

      <h4 className=" ms-4" style={{ color: "white" }}>
        Kolekcje użytkownika {user?.userName}
      </h4>

      {/*////////////////////////////////////////////////////////////////////////////////
      // Do przerzucenia do osobnego modułu
      // */}

      {movieCollections.map((movieCollection) => (
        <div
          key={movieCollection.movieCollectionId}
          className="d-flex justify-content-center"
        >
          <MovieCollectionCard
            key={movieCollection.movieCollectionId}
            movieCollection={movieCollection}
            loggedUserName={loggedUserName}
            isLoggedUserMod={isLoggedUserMod}
            userPage={true}
            isFriend={isFriend}
            setError={setError}
            setLoading={setLoading}
          />
        </div>
      ))}

      {/*////////////////////////////////////////////////////////////////////////////////*/}

      <div className="mt-3">
        <PaginationModule
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </div>
    </div>
  );
};

export default MovieCollectionByUserPage;
