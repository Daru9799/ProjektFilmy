import { useState } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { useCreateRecommendation, useDeleteLikeRecommendation, useLikeRecommendation, useRecommendationsByMovie } from "../../API/MovieRecommendAPI";
import RecommendListModule from "../MovieRecommend_componets/RecommendListModule";
import PaginationModule from "../SharedModals/PaginationModule";
import useMovieChoiceModule from "../../hooks/useMovieChoiceModule";
import MovieSingleChoiceModal from "../MovieRecommend_componets/MovieSingleChoiceModal";
import ActionPendingModal from "../SharedModals/ActionPendingModal";

interface Props {
  movieId: string | undefined,
}

const RecommendMovieModule = ({movieId}:Props) => {
  const[currentPage,setCurrentPage] = useState(1)
  const staticPageSize = 3;
	const [open, setOpen] = useState(false);
  const [openMovieModal,setOpenMovieModal] = useState(false)

  const {
    movies,
    tempSelectedMovie, // Zmienione na pojedynczy film
    handleOpenModal,
    handleToggleSelect,
    handleConfirmSelection,
    currentPageMC,
    pageInfoMC,
    handlePageChangeMC,
    searchText,
    setSearchText,
    handleSort,
    isNoMovieModalVisible,
    setIsNoMovieModalVisible,
    setFilterList,
  } = useMovieChoiceModule();

  //Api hooks:
  const { data: recommendationData, error: recommendationListError } = useRecommendationsByMovie(movieId, currentPage, staticPageSize);
  const recommendList = recommendationData?.recommendations || [];
  const movieList = recommendationData?.movies || [];
  const pageInfo = recommendationData?.pagination;
  //Mutacje
  const { mutate: likeRecommendation, isPending: likingPending, error: likeError } = useLikeRecommendation();
  const { mutate: deleteLikeRecommendation, isPending: dislikingPending, error: dislikeError  } = useDeleteLikeRecommendation();
  const { mutate: createRecommendation, isPending: creatingPending, error: createRecommendationError } = useCreateRecommendation();

  const onLikeToggle = async (recommendationId: string, isLiking: boolean) => {
    if (isLiking) {
      likeRecommendation(recommendationId);
    } else {
      deleteLikeRecommendation(recommendationId);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log(pageInfo);
  };

  const handleCreateRecommendation= () => {
    if (!movieId || !tempSelectedMovie?.movieId) return;
    console.log("sfs: ", tempSelectedMovie.movieId)
    createRecommendation({ movieId, recommendMovieId: tempSelectedMovie.movieId });
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
          {recommendList.length > 0 && (
            <PaginationModule
              currentPage={pageInfo?.pageNumber}
              totalPages={pageInfo?.totalPages}
              onPageChange={handlePageChange}
            />
          )}
          <div className="d-grid gap-2 col-4 mx-auto">
            <Button
              onClick={() => {
                setOpenMovieModal(true);
                handleOpenModal();
              }}
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
      <ActionPendingModal show={likingPending} message="Trwa dodawanie polubienia..."/>
      <ActionPendingModal show={dislikingPending} message="Trwa usuwanie polubienia..."/>
      <ActionPendingModal show={creatingPending} message="Trwa dodawanie rekomendacji..." />
    </div>
  );
}

export default RecommendMovieModule;