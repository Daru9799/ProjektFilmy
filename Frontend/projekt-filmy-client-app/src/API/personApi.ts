import axios from "axios";   // do zmiany

export const fetchDirectorMovies = async (directorId: string, setMovies: React.Dispatch<React.SetStateAction<any[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    const response = await axios.get(
      `https://localhost:7053/api/Movies/by-directorId/${directorId}`);

    if (response.status === 200) {
      const data = response.data.$values;
      setMovies(data); 
    }
  } catch (reviewsError) {
    if (axios.isAxiosError(reviewsError) && reviewsError.response?.status === 404) {
      setMovies([]); 
      console.log("Nie znaleznio filmów dla tego reżysera");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(reviewsError);
    }
  } finally {
    setLoading(false); 
  }
};


export const fetchActorMovies = async (actorId: string, setMovies: React.Dispatch<React.SetStateAction<any[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    const response = await axios.get(
      `https://localhost:7053/api/Movies/by-actorId/${actorId}`);

    if (response.status === 200) {
      const data = response.data.$values;
      setMovies(data); 
    }
  } catch (reviewsError) {
    if (axios.isAxiosError(reviewsError) && reviewsError.response?.status === 404) {
      setMovies([]); 
      console.log("Nie znaleznio filmów dla tego aktora");
    } else {
      setError("Błąd podczas wczytywania danych");
      console.error(reviewsError);
    }
  } finally {
    setLoading(false); 
  }
};

// Do pobrania wszystkich osób po określonej roli
export const fetchPeopleByRole= async()=>{};

