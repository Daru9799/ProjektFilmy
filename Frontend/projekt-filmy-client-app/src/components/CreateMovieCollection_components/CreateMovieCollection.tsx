import "../../styles/CreateMovieCollection.css";
import CollectionForm from "./CollectionForm";
import MovieSelectionModal from "./MovieSelectionModal";
import SelectedMoviesList from "./SelectedMoviesList";
import useCreateMovieCollection from "../../hooks/useCreateMovieCollection";
import InfoModal from "../SharedModals/InfoModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useCreateMovieCollectionApi } from "../../API/MovieCollectionApi";
import ActionPendingModal from "../SharedModals/ActionPendingModal";
import { toast } from "react-toastify";
import { getApiError } from "../../functions/getApiError";
import ApiErrorDisplay from "../ApiErrorDisplay";
import SpinnerLoader from "../SpinnerLoader";

const CreateMovieCollection = () => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    shareMode,
    setShareMode,
    allowCopy,
    setAllowCopy,
    showModal,
    movies,
    isMovieLoading,
    moviesError,
    selectedMovies,
    setSelectedMovies,
    tempSelectedMovies,
    setMovieIds,
    handleOpenModal,
    handleToggleSelect,
    handleConfirmSelection,
    pageInfo,
    currentPage,
    handlePageChange,
    handleCloseModal,
    searchText,
    setSearchText,
    setFilterList,
    handleSort,
    isNoMovieModalVisible,
    setIsNoMovieModalVisible,
  } = useCreateMovieCollection();

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [loggedUsername] = useState<string | null>(
    localStorage.getItem("logged_username")
  );

  const { mutate: createCollection, isPending: creatingCollection } =
    useCreateMovieCollectionApi();

  const renderTooltip = (props: any) => (
    <Tooltip {...props}>Powrót do profilu</Tooltip>
  );

return (
  <div className="create-collection-container responsive-create-collection">
    <h2 className="text-center my-4">Utwórz nową kolekcję filmów</h2>

    <div className="d-flex justify-content-center mb-3">
      <OverlayTrigger placement="top" overlay={<Tooltip>Powrót do profilu</Tooltip>}>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(`/user/${loggedUsername}`)}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      </OverlayTrigger>
    </div>

    <div className="collection-form-wrapper">
      <CollectionForm
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        shareMode={shareMode}
        setShareMode={setShareMode}
        allowCopy={allowCopy}
        setAllowCopy={setAllowCopy}
      />
    </div>

    <div className="selected-movies-wrapper">
      <SelectedMoviesList
        selectedMovies={selectedMovies}
        setSelectedMovies={setSelectedMovies}
        setMovieIds={setMovieIds}
      />
    </div>

    <div className="mt-3 d-flex flex-wrap justify-content-center gap-2 button-group">
      <button className="btn btn-success" onClick={handleOpenModal}>
        Dodaj film
      </button>

      <button
        className="btn btn-primary"
        onClick={async () => {
          if (!title.trim()) return setShowInfoModal(true);
          createCollection(
            {
              title,
              description,
              shareMode,
              type: 2,
              allowCopy,
              movieIds: selectedMovies.map((m) => m.movieId),
            },
            {
              onSuccess: () => setShowSuccessModal(true),
              onError: (err) => {
                const apiErr = getApiError(err);
                toast.error(
                  `Nie udało się utworzyć kolekcji. [${apiErr?.statusCode}] ${apiErr?.message}`
                );
              },
            }
          );
        }}
        disabled={creatingCollection}
      >
        Utwórz kolekcję
        <ActionPendingModal show={creatingCollection} message="Trwa tworzenie kolekcji..." />
      </button>
    </div>

    {isMovieLoading ? (
      <SpinnerLoader />
    ) : moviesError ? (
      <ApiErrorDisplay apiError={moviesError} />
    ) : (
      <MovieSelectionModal
        show={showModal}
        onClose={handleCloseModal}
        movies={movies}
        tempSelectedMovies={tempSelectedMovies}
        onToggleSelect={handleToggleSelect}
        onConfirm={handleConfirmSelection}
        currentPage={currentPage}
        totalPages={pageInfo.totalPages}
        onPageChange={handlePageChange}
        searchText={searchText}
        setSearchText={setSearchText}
        setFilterList={setFilterList}
        handleSort={handleSort}
        isNoMovieModalVisible={isNoMovieModalVisible}
        setIsNoMovieModalVisible={setIsNoMovieModalVisible}
      />
    )}

    <InfoModal
      show={showInfoModal}
      title="Błąd"
      onClose={() => setShowInfoModal(false)}
      message="Tytuł kolekcji jest wymagany."
      variant="danger"
    />

    <InfoModal
      show={showSuccessModal}
      title="Sukces"
      onClose={() => {
        setShowSuccessModal(false);
        navigate(`/user/${loggedUsername}/movieCollection`);
      }}
      message="Kolekcja została pomyślnie utworzona!"
      variant="success"
    />
  </div>
);

};

export default CreateMovieCollection;
