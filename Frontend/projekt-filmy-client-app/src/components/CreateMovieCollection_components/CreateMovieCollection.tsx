import "../../styles/CreateMovieCollection.css";
import CollectionForm from "./CollectionForm";
import MovieSelectionModal from "./MovieSelectionModal";
import SelectedMoviesList from "./SelectedMoviesList";
import useCreateMovieCollection from '../../hooks/useCreateMovieCollection';
import InfoModal from "../SharedModals/InfoModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


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
  error,
  loading,
  handleOpenModal,
  handleToggleSelect,
  handleConfirmSelection,
  handleCreateCollection,
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

  return (
    <div className="create-collection-container">
      <h2 style={{ marginTop: "2%", marginBottom: "5%" }}>Utwórz nową kolekcję filmów</h2>

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

      {error && <div className="error-message">{error}</div>}

      <SelectedMoviesList
        selectedMovies={selectedMovies}
        setSelectedMovies={setSelectedMovies}
        setMovieIds={setMovieIds}
      />

            <div style={{ marginTop: "5%" }}>
        <button className="green-button" onClick={handleOpenModal}>
          Dodaj film
        </button>
      </div>

      <button
        onClick={async () => {
            if (title.trim() === "") {
              setShowInfoModal(true);
            } else {
              const success = await handleCreateCollection();
              if (success) {
                setShowSuccessModal(true);
              }
            }
          }}
        disabled={loading}
        className="edit-button"
        style={{ marginTop: "5%", marginBottom: "5%" }}
      >
        {loading ? "Tworzenie..." : "Utwórz kolekcję"}
      </button>

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
        onClose={() => setShowInfoModal(false)}
        message="Tytuł kolekcji jest wymagany."
      />

      <InfoModal
        show={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/");
        }}
        message="Kolekcja została pomyślnie utworzona!"
      />

      
    </div>
  );
};

export default CreateMovieCollection;
