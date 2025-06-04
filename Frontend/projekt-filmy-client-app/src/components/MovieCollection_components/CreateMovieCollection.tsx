import "../../styles/MovieCollection.css";
import CollectionForm from "./CollectionForm";
import MovieSelectionModal from "./MovieSelectionModal";
import SelectedMoviesList from "./SelectedMoviesList";
import useCreateMovieCollection from '../../hooks/useCreateMovieCollection';

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
    availableMovies,
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
    setShowModal,
  } = useCreateMovieCollection();

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
        onClick={handleCreateCollection}
        disabled={loading || title.trim() === ""}
        className="edit-button"
        style={{ marginTop:"5%", marginBottom: "5%" }}
      >
        {loading ? "Tworzenie..." : "Utwórz kolekcję"}
      </button>

      <MovieSelectionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        availableMovies={availableMovies}
        tempSelectedMovies={tempSelectedMovies}
        onToggleSelect={handleToggleSelect}
        onConfirm={handleConfirmSelection}
      />
    </div>
  );
};

export default CreateMovieCollection;
