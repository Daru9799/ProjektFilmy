import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { Movie } from "../../models/Movie";
import { Recommendation } from "../../models/Recommendation";
import { CreateRecommendation, DeleteLikeRecommendation, fetchRecommendByMovieId, LikeRecommendation } from "../../API/MovieRecommendAPI";
import { fetchMoviesListByIds } from "../../API/movieApi";
import RecommendListModule from "../MovieRecommend_componets/RecommendListModule";
import PaginationModule from "../SharedModals/PaginationModule";
import useMovieChoiceModule from "../../hooks/useMovieChoiceModule";
import MovieSingleChoiceModal from "../MovieRecommend_componets/MovieSingleChoiceModal";

interface Props {
  movieId: string | undefined,
}

const RecommendMovieModule = ({movieId}:Props) => {
	const [movieList, setMovieList] = useState<Movie[]>([]);
	const [recommendList, setRecommendList ] = useState<Recommendation[]>([]);
	const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
	const [pageInfo, setPageInfo] = useState({
		totalItems: 0,
		pageNumber: 1,
		pageSize: 2,
		totalPages: 2,
	});
  const[currentPage,setCurrentPage] = useState(1)
  const staticPageSize = 2;

	const [open, setOpen] = useState(false);
  const [openMovieModal,setOpenMovieModal] = useState(false)

  const {
    choosenMovieId,
    setChoosenMovieId,
    showModal,
    setShowModal,
    movies,
    tempSelectedMovie, // Zmienione na pojedynczy film
    setTempSelectedMovie, // Zmienione na pojedynczy film
    handleOpenModal,
    handleToggleSelect,
    handleConfirmSelection,
    currentPageMC,
    pageInfoMC,
    handlePageChangeMC,
    searchText,
    setSearchText,
    handleCloseModal,
    handleSort,
    isNoMovieModalVisible,
    setIsNoMovieModalVisible,
    setFilterList,
  } = useMovieChoiceModule();

	useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Pobierz rekomendacje (z await!)
        const recommendations = await fetchRecommendByMovieId(
          movieId,
          currentPage,
          staticPageSize,
          setPageInfo,
          setError
        );
        setRecommendList(recommendations);
        // 2. Wyodrębnij ID polecanych filmów
        const recommendedMovieIds = recommendations.map(
          (rec: Recommendation) => rec.recommendedMovieId
        );
        // 3. Pobierz pełne informacje o filmach
        if (recommendedMovieIds.length > 0) {
            fetchMoviesListByIds(
            recommendedMovieIds,
            setMovieList
          );
        } else {
          setMovieList([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, currentPage]);

  useEffect(()=>{},[])


  const onLikeToggle = async (recommendationId: string, isLiking: boolean) => {
    try {
      setError(null);
      if (isLiking) {
        await LikeRecommendation(recommendationId); // Dodaj await
      } else {
        await DeleteLikeRecommendation(recommendationId);
      }
      // Dodaj odświeżenie danych lub aktualizację stanu
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
      console.error("Error toggling like:", err);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(pageInfo);
  };

  const handleCreateRecommendation= async()=> {
    try {
      const result = await CreateRecommendation(movieId, tempSelectedMovie?.movieId);
      console.log('Success:', result);
      // Możesz tu dodać przekierowanie lub odświeżenie danych
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.log("ErrorMessage:" + err.message);
      } else {
        setError('An unexpected error occurred');
      }
      
    }
  }

  return (
    <div
      className="p-2 w-75 m-auto"
      style={{
        backgroundColor: "#150021",
        borderRadius: "15px",
      }}
    >
      <div className="d-grid gap-2 col-5 mx-auto my-2">
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="recommend-movie-list"
          aria-expanded={open}
          className="btn btn-light"
        >
          Rekomendacje
        </Button>
      </div>

      <Collapse in={open}>
        <div id="recommend-movie-list">
          <RecommendListModule
            movieList={movieList}
            recommendations={recommendList}
            onLikeToggle={onLikeToggle}
          />
          <PaginationModule
            currentPage={pageInfo.pageNumber}
            totalPages={pageInfo.totalPages}
            onPageChange={handlePageChange}
          />
          <div className="d-grid gap-2 col-4 mx-auto">
            <Button
              onClick={() => {
                setOpenMovieModal(true);
                handleOpenModal();}
              }
              className="btn btn-success"
            >
              Dodaj rekomendacje
            </Button>
          </div>
        </div>
      </Collapse>
      <MovieSingleChoiceModal
        show={openMovieModal}
        onClose={() => {
          setOpenMovieModal(false);
        }}
        movies={movies}
        tempSelectedMovie={tempSelectedMovie}
        onToggleSelect={handleToggleSelect}
        onConfirm={() => {
          handleConfirmSelection(); //raczej nie potrzebne
          handleCreateRecommendation();
          setOpenMovieModal(false);
        }}
        currentPage={currentPageMC}
        totalPages={pageInfoMC.totalPages}
        onPageChange={handlePageChangeMC}
        searchText={searchText}
        setSearchText={setSearchText}
        setFilterList={setFilterList}
        handleSort={handleSort}
        isNoMovieModalVisible={isNoMovieModalVisible}
        setIsNoMovieModalVisible={setIsNoMovieModalVisible}
      />
    </div>
  );
}

export default RecommendMovieModule;