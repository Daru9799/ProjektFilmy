import React, { ReactNode } from "react";
import SearchModule from "../SearchModule";


const SearchMoviesPage = () => {

  return (
    <div className="vh-100">
      <SearchModule placeHolderText="Podaj tytuł filmu"/>
    </div>
  );
};

export default SearchMoviesPage;