import axios from "axios";

export const fetchAllCategories = async (
    setCategoryData:React.Dispatch<React.SetStateAction<any[]>>
    ) => {
    await axios
      .get("https://localhost:7053/api/Categories/all")
      .then((response) => {
        if (response.data && response.data.$values) {
          setCategoryData(response.data.$values);
          console.log(response.data.$values);
        } else {
          setCategoryData([]);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
};