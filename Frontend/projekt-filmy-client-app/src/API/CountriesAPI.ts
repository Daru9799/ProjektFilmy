import axios from "axios";

export const fetchAllCountries = async (
  setCountryData: React.Dispatch<React.SetStateAction<any[]>>) => {
  await axios
    .get("https://localhost:7053/api/Countries/all")
    .then((response) => {
      if (response.data && response.data.$values) {
        setCountryData(response.data.$values);
        console.log(response.data.$values);
      } else {
        setCountryData([]);
      }
    })
    .catch((error) => console.error("Error fetching countries:", error));
};
