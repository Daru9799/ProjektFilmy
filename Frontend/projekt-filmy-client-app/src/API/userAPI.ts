import axios from "axios";

export const fetchUserData = async (
  userName: string,
  setUser: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(
      `https://localhost:7053/api/Users/by-username/${userName}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setUser(response.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        setError("Błąd sieci: nie można połączyć się z serwerem.");
      } else if (err.response.status === 404) {
        setError(`Użytkownik o nazwie '${userName}' nie został znaleziony.`);
      } else {
        setError(`Błąd: ${err.response.status} - ${err.response.statusText}`);
      }
    } else {
      setError("Wystąpił nieoczekiwany błąd.");
    }
    console.error(err);
  } finally {
    setLoading(false);
  }
};


// Fetch user reviews
export const fetchUserReviews = async (
  userName: string,
  pageSize: number,
  setReviews: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const reviewsResponse = await axios.get(
      `https://localhost:7053/api/Reviews/by-username/${userName}`,
      {
        params: {
          pageNumber: 1,
          pageSize, 
          orderBy: "desc",
          sortDirection: "year",
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const { data } = reviewsResponse.data;
    if (data && data.$values) {
      setReviews(data.$values);
    } else {
      setReviews([]);
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        setReviews([]);
      } else {
        setError("Wystąpił błąd podczas pobierania recenzji.");
      }
    }
    console.error(err);
  }
};


export const fetchUserStatistics = async (
  userName: string,
  setUser: React.Dispatch<React.SetStateAction<any>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(
      `https://localhost:7053/api/users/statistics/${userName}`,{
                  headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
      
    );
    setUser(response.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        setError("Błąd sieci: nie można połączyć się z serwerem.");
      } else if (err.response.status === 404) {
        setError(`Użytkownik o nazwie '${userName}' nie został znaleziony.`);
      } else {
        setError(`Błąd: ${err.response.status} - ${err.response.statusText}`);
      }
    } else {
      setError("Wystąpił nieoczekiwany błąd.");
    }
    console.error(err);
  } finally {
    setLoading(false);
  }
};