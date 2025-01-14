import 'bootstrap/dist/css/bootstrap.min.css';
import { Actor } from '../../models/Actor';
import { useNavigate } from 'react-router-dom';
import '../../styles/Zoom.css'

interface Props {
  actorsList:Actor[]
}

const ActorsListModule = ({ actorsList }: Props) => {
  const navigate = useNavigate(); 

  const handleCardClick = (actorId: string) => {
    navigate(`/actor/${actorId}`); 
  };
  return (
    <div className="container d-flex justify-content-center align-items-top p-0">
      <ul className="list-group">
        {actorsList.map((actor) => (
          <li className="list-group-item d-flex align-items-start p-3 zoomCard" 
          onClick={() => handleCardClick(actor.actorId)}
          style={{ borderBottom: "1px solid #ddd", width: "600px", height: "180px", borderRadius: "15px", marginBottom: "5px", cursor:"pointer" }}>
          <img 
            src={actor.photoUrl} 
            alt={`${actor.firstName} ${actor.lastName}`} 
            style={{ 
              width: "100px", 
              height: "150px", 
              objectFit: "cover", 
              marginRight: "15px", 
              borderRadius: "5px",
            }}
          />
          
          <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
            <div className="d-flex justify-content-between align-items-start" style={{ marginBottom: "10px" }}>
              <h5 className="mb-2" style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                {actor.firstName} {actor.lastName}
              </h5>

              <div style={{ backgroundColor: "#2E5077", color: "white", padding: "5px 10px", borderRadius: "8px", fontSize: "1rem" }}>
              <p className="mb-0">
                {actor.totalMovies === 0
                  ? "Brak filmów"
                  : `${actor.totalMovies} ${actor.totalMovies === 1 ? "film" : "filmy"}`}
              </p>
              </div>
            </div>
        
            <div
              className="d-flex flex-wrap"
              style={{
                marginTop: "auto",
                fontSize: "0.9rem",
                color: "#555",
                justifyContent: "flex-start",
              }}
            >
              <strong>Najczęściej gra w: </strong>
              {actor.favoriteGenre ? (
                <div
                  className="badge me-2 mb-2"
                  style={{
                    backgroundColor: "#2E5077",
                    padding: "8px 12px",
                    textAlign: "center",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    borderRadius: "15px",
                    marginLeft: "10px"
                  }}
                >
                  {actor.favoriteGenre}
                </div>
              ) : (
                <p className="text-dark" style={{ paddingLeft: "5px" }}> Brak danych.</p>
              )}
            </div>
          </div>
        </li>
        ))}
      </ul>
    </div>
  );
};

export default ActorsListModule;