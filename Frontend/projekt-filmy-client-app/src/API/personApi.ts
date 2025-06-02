import axios from "axios";   // do zmiany
import { Person } from "../models/Person";

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
export const fetchPeopleByRole = async (
  currentPage: number,
  staticPageSize: number,
  searchText: string = "",
  roleNumb: number,
  setPerson: React.Dispatch<React.SetStateAction<Person[]>>,
  setPagination: React.Dispatch<
    React.SetStateAction<{
      totalItems: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>
  >
): Promise<void> => {
  return axios
    .get("https://localhost:7053/api/People/by-filters", {
      params: {
        pageNumber: currentPage,
        pageSize: staticPageSize, // odpowiedzialna za ilość jednocześnie wyświetlanych filmów
        personSearch: searchText,
        role: roleNumb,
      },
    })
    .then((response) => {
      if (response.data) {
        const { data, totalItems, pageNumber, pageSize, totalPages } =
          response.data;
        setPagination({
          totalItems,
          pageNumber,
          pageSize,
          totalPages,
        });
        setPerson(data.$values);
        console.log("fetchPeopleByRole: Załadowano osoby.", data);
        console.log({ totalItems, pageNumber, pageSize, totalPages });
      } else {
        setPerson([]);
      }
    })
    .catch((error) => console.error("Error fetching persons:", error));
};

export const fetchByPersonSearchAndRole = async (
  currentPage: number,
  staticPageSize: number,
  searchText: string,
  roleNum: number,
  setPerson: React.Dispatch<React.SetStateAction<Person[]>>,
  setPagination: React.Dispatch<
    React.SetStateAction<{
      totalItems: number;
      pageNumber: number;
      pageSize: number;
      totalPages: number;
    }>
  >
) => {
  axios
    .get("https://localhost:7053/api/People/by-filters", {
      params: {
        pageNumber: currentPage,
        pageSize: staticPageSize,
        personSearch: searchText,
        role: roleNum,
      },
    })
    .then((response) => {
      if (response.data) {
        const { data, totalItems, pageNumber, pageSize, totalPages } =
          response.data;
        setPagination({
          totalItems,
          pageNumber,
          pageSize,
          totalPages,
        });
        if (data.$values.length === 0) {
          setPagination({
            totalItems: totalItems,
            pageNumber: 1,
            pageSize: pageSize,
            totalPages: 1,
          });
        }
        setPerson(data.$values);
        console.log("fetchByPersonSearchAndRole: Załadowano osoby.", data);
        console.log({totalItems,pageNumber,pageSize,totalPages});
      } else {
        setPerson([]);
      }
    })
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        // Obsługa AxiosError
        if (error.response) {
          // Serwer zwrócił odpowiedź z kodem błędu
          console.error(
            `Error ${error.response.status}: ${
              error.response.data?.message || "Wystąpił błąd"
            }`
          );
          if (error.response.status === 404) {
            // Obsługa błędu 404
            console.error("Nie znaleziono zasobu.");
            setPerson([]);
            setPagination({
              totalItems: 0,
              pageNumber: 1,
              pageSize: 2,
              totalPages: 1,
            });
          }
        }
      } else {
        // Inny rodzaj błędu (nie związany z Axios)
        console.error("Nieznany błąd:", error);
      }
    });
};