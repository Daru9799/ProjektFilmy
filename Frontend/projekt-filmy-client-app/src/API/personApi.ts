import axios from "axios";   // do zmiany
import { Person } from "../models/Person";


export const fetchPersonById = async (
  id: string | undefined,
  setPerson: React.Dispatch<React.SetStateAction<Person | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const actorResponse = await axios.get(
      `https://localhost:7053/api/People/${id}`
    );
    setPerson(actorResponse.data);
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        setError("Błąd sieci: nie można połączyć się z serwerem.");
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

export const fetchPersonMovies = async (
  personId: string,
  setMovies: React.Dispatch<React.SetStateAction<any[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response = await axios.get(
      `https://localhost:7053/api/Movies/by-personId/${personId}`
    );

    if (response.status === 200) {
      const data = response.data.$values;
      setMovies(data);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      setMovies([]);
      console.log("Nie znaleziono filmów dla tej osoby.");
    } else {
      setError("Błąd podczas wczytywania danych.");
      console.error(error);
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
    }>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
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
    .catch((error) => setError("Error fetching persons:" + error))
    .finally(() => setLoading(false));
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
    }>>
): Promise<Person[]> => {
  // Zwracamy Promise<Person[]>
  try {
    const response = await axios.get(
      "https://localhost:7053/api/People/by-filters",
      {
        params: {
          pageNumber: currentPage,
          pageSize: staticPageSize,
          personSearch: searchText,
          role: roleNum,
        },
      }
    );

    if (response.data) {
      const { data, totalItems, pageNumber, pageSize, totalPages } =
        response.data;
      const people = data.$values || []; // Zabezpieczenie przed undefined

      setPerson(people);
      setPagination({
        totalItems,
        pageNumber,
        pageSize,
        totalPages,
      });

      return people; // Zwracamy people (zawsze tablica)
    }
    return []; // Jeśli brak response.data
  } catch (error) {
    setPerson([]);
    setPagination({
      totalItems: 0,
      pageNumber: 1,
      pageSize: staticPageSize,
      totalPages: 1,
    });
    return []; // W przypadku błędu też zwracamy pustą tablicę
  }
};

export const fetchByPersonSearchAndRoleNoPgnt = async (
  searchText: string,
  roleNum: number,

): Promise<Person[]> => {
  // Zwracamy Promise<Person[]>
  try {
    const response = await axios.get(
      "https://localhost:7053/api/People/by-filters",
      {
        params: {
          noPagination: true,
          personSearch: searchText,
          role: roleNum,
        },
      }
    );

    if (response.data) {
      const { data, totalItems, pageNumber, pageSize, totalPages } = response.data;
      const people = data.$values || []; // Zabezpieczenie przed undefined
      return people; // Zwracamy people (zawsze tablica)
    }

    return []; // Jeśli brak response.data

  } catch (error) {
    return []; // W przypadku błędu też zwracamy pustą tablicę
  }
};