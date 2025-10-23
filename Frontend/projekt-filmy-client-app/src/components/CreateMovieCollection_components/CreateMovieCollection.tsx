import "../../styles/CreateMovieCollection.css";
import CollectionForm from "./CollectionForm";
import MovieSelectionModal from "./MovieSelectionModal";
import SelectedMoviesList from "./SelectedMoviesList";
import useCreateMovieCollection from '../../hooks/useCreateMovieCollection';
import InfoModal from "../SharedModals/InfoModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useCreateMovieCollectionApi } from "../../API/MovieCollectionApi";
import ActionPendingModal from "../SharedModals/ActionPendingModal";
import { toast } from "react-toastify";
import { getApiError } from "../../functions/getApiError";

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
  const [loggedUsername, setLoggedUsername] = useState<string | null>(localStorage.getItem("logged_username"));
  //Api hook
  const { mutate: createCollection, isPending: creatingCollection } = useCreateMovieCollectionApi();

  const renderTooltip = (props: any) => (
    <Tooltip {...props}>Powrót do profilu</Tooltip> // Treść dymka tooltipa
  );

  return (
    <div className="create-collection-container">

      <h2 style={{ marginTop: "2%", marginBottom: "5%" }}>Utwórz nową kolekcję filmów</h2>
        <OverlayTrigger placement="top" overlay={renderTooltip}>
        <button
          className="btn btn-secondary mb-3"
          onClick={() => navigate(`/user/${loggedUsername}`)}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      </OverlayTrigger>

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

      <SelectedMoviesList
        selectedMovies={selectedMovies}
        setSelectedMovies={setSelectedMovies}
        setMovieIds={setMovieIds}
      />

      <div className="mt-3 d-flex justify-content-center gap-2">
        <button className="btn btn-success" onClick={handleOpenModal}>
          Dodaj film
        </button>
        <button
          className="btn btn-primary"
          onClick={async () => {
            if (!title.trim()) return setShowInfoModal(true);
            createCollection({ title, description, shareMode, type: 2, allowCopy, movieIds: selectedMovies.map(m => m.movieId) },
              { 
                onSuccess: () => {
                  setShowSuccessModal(true) 
                },
                onError: (err) => {
                  const apiErr = getApiError(err);
                  toast.error(`Nie udało się utworzyć kolekcji. [${apiErr?.statusCode}] ${apiErr?.message}`);
                }
              }
            );
          }}
          disabled={creatingCollection}
        >
          Utwórz kolekcję
          <ActionPendingModal show={creatingCollection} message="Trwa tworzenie kolekcji..." />
        </button>
      </div>

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
          navigate( `/user/${loggedUsername}/movieCollection`);
        }}
        message="Kolekcja została pomyślnie utworzona!"
        variant="success"
      />
      
    </div>
  );
};

export default CreateMovieCollection;
