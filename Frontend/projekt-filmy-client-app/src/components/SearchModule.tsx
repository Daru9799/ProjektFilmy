import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


interface Props {
  placeHolderText:string
  getText: (item:string) => void;
  submit:() => void;
}

const SearchModule = ({ placeHolderText, getText, submit }: Props) => {
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = () => {
    // Funkcja do wyszukiwania filmu
    console.log("Searching for: ", searchText);
    // Możesz tu dodać kod do wykonania zapytania do API, np. do wyszukiwania filmów
    getText(searchText);
    submit();
  };

  return (
    <div className="container d-flex justify-content-center align-items-top p-0">
      <div className="card p-3" style={{ width: "100%", maxHeight: "70px" }}>
        <div className="d-flex justify-content-center">
          <input
            type="text"
            className="form-control me-2 w-50" // 'me-2' adds margin-right to space the input from the button
            id="search"
            placeholder={placeHolderText}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleSearch}
            disabled={!searchText} // Przycisk jest wyłączony, jeśli pole jest puste
          >
            Szukaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModule;