import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MovieCollection.css";
import axios from "axios";

const CreateMovieCollection = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shareMode, setShareMode] = useState(0);
  const [allowCopy, setAllowCopy] = useState(true);
  const [movieIds, setMovieIds] = useState<string>(""); 

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateCollection = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        title,
        description,
        shareMode,
        type:2,
        allowCopy,
        movieIds: movieIds
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0),
      };

      const response = await axios.post(
        "https://localhost:7053/api/MovieCollection/add-collection",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Kolekcja została utworzona!");
      navigate("/"); 
    } catch (err: any) {
      console.error("Błąd przy tworzeniu kolekcji:", err);
      setError("Nie udało się utworzyć kolekcji. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-collection-container">
      <h2 style={{marginTop:"7%", marginBottom:"12%"}}>Utwórz nową kolekcję filmów</h2>

      <div>
        <label>Tytuł:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label style={{marginTop:"5%"}}>Opis:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label style={{marginTop:"5%"}}>Tryb udostępniania:</label>
        <select value={shareMode} onChange={(e) => setShareMode(Number(e.target.value))}>
          <option value={0}>Prywatna</option>
          <option value={1}>Tylko znajomi</option>
          <option value={2}>Publiczna</option>
        </select>
      </div>

        <div className="checkbox-row" style={{marginTop:"5%", marginLeft:"35%"}}>
        <label >Pozwól na kopiowanie</label>
        <input
            type="checkbox"
            checked={allowCopy}
            style={{marginBottom:"-0.5%"}}
            onChange={(e) => setAllowCopy(e.target.checked)}
        />
        </div>

      {error && <div className="error-message">{error}</div>}

        <div style={{marginTop:"7%"}}>
                <button>Dodaj film</button>
        </div>


      <button onClick={handleCreateCollection} disabled={loading} className="edit-button" style={{marginTop:"10%"}}>
        {loading ? "Tworzenie..." : "Utwórz kolekcję"}
      </button>
    </div>
  );
};

export default CreateMovieCollection;
