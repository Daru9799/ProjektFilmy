import axios from "axios";
import stringSimilarity from "string-similarity";

import React, { useState, useEffect } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { Category } from "../../models/Category";
import { Country } from "../../models/Country";
import { Person } from "../../models/Person";
import { Director } from "../../models/Director";

import { fetchAllCategories } from "../../API/CategoriesAPI";
import { fetchAllCountries } from "../../API/CountriesAPI";

interface Props {
  // Pobranie Kategori jako string[], Krajów jako string[], Aktorów jako Actor[], Reżyserów jako Director[] 
  getFilters: (list:[string[],string[],string[],string[]]) => void;
}

const FilterMovieModule = ({ getFilters }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [countryData, setCountryData] = useState<Country[]>([]);
  const [actorData, setActorData] = useState<Person[]>([]);
  const [directorData, setDirectorData] = useState<Director[]>([]);

  const [dataToShow, setDataToShow] = useState<Country[] | Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const [actorName, setActorName] = useState<string>("");
  const [selectedActors, setSelectedActors] = useState<Person[]>([]);

  const [directorName, setDirectorName] = useState<string>("");
  const [selectedDirectors, setSelectedDirectors] = useState<Director[]>([]);

  // Do ustawiania stopnia pasowania przy dodawaniu Aktorów i Reżyserów(0.0 - 1.0)
  const rateThreShold = 0.6;

  useEffect(() => {
    const selectedActorsStrings = selectedActors.map(
      (actor) => `${actor.firstName} ${actor.lastName}`
    );
    const selectedDirectorsStrings = selectedDirectors.map(
      (director) => `${director.firstName} ${director.lastName}`
    );

    getFilters([
      selectedCategories,
      selectedCountries,
      selectedActorsStrings,
      selectedDirectorsStrings,
    ]);
    console.log("getFilter się wykonał");
  }, [selectedCategories, selectedCountries, selectedActors, selectedDirectors]);

  const tabs = [
    { key: "gatunki", label: "Gatunki" },
    { key: "kraje", label: "Kraje" },
    { key: "rezyszerzy", label: "Reżyserzy" },
    { key: "aktorzy", label: "Aktorzy" },
  ];

  useEffect(() => {
    fetchAllCategories(setCategoryData);
    fetchAllCountries(setCountryData);

    // Do zmiany w dół:
    axios
      .get("https://localhost:7053/api/Actors/all", {
        params: {
          NoPagination: true, //Pobieranie bez paginacji (wszystko na raz)
        },
      })
      .then((response) => {
        if (response) {
          const { data, totalItems, pageNumber, pageSize, totalPages } =
            response.data;
          setActorData(data.$values);
          console.log(data.$values);
        } else {
          setActorData([]);
        }
      })
      .catch((error) => console.error("Error fetching actors:", error));

    axios
      .get("https://localhost:7053/api/Directors/all", {
        params: {
          NoPagination: true, //Pobieranie bez paginacji (wszystko na raz)
        },
      })
      .then((response) => {
        if (response) {
          const { data, totalItems, pageNumber, pageSize, totalPages } =
            response.data;
          setDirectorData(data.$values);
        } else {
          setDirectorData([]);
        }
      })
      .catch((error) => console.error("Error fetching directors:", error));
    // do zmiany w góre 
  }, []);

  

  const handleTabClick = (tabKey: string) => {
    if (activeTab === tabKey) {
      setActiveTab(null);
    } else {
      setActiveTab(tabKey);
      if (tabKey === "gatunki") setDataToShow(categoryData);
      if (tabKey === "kraje") setDataToShow(countryData);
    }
  };

  const handleCheckboxChange = (
    id: string,
    isChecked: boolean,
    type: string
  ) => {
    if (type === "gatunki") {
      setSelectedCategories((prev) =>
        isChecked ? [...prev, id] : prev.filter((genreId) => genreId !== id)
      );
    } else if (type === "kraje") {
      setSelectedCountries((prev) =>
        isChecked ? [...prev, id] : prev.filter((countryId) => countryId !== id)
      );
    }
  };

  const handleActorSearch = () => {
    // Połącz imiona i nazwiska aktorów w jeden ciąg, aby dopasować do actorName
    const actorNames = actorData.map((a) => `${a.firstName} ${a.lastName}`);

    // Znajdź najlepsze dopasowanie
    const { bestMatch } = stringSimilarity.findBestMatch(
      actorName.toLowerCase(),
      actorNames.map((name) => name.toLowerCase())
    );

    // Sprawdź, czy wynik jest wystarczająco podobny (ustaw próg, np. 0.7)
    if (bestMatch.rating >= rateThreShold) {
      const actor = actorData.find(
        (a) => `${a.firstName} ${a.lastName}`.toLowerCase() === bestMatch.target
      );

      // Jeśli aktor istnieje i nie jest jeszcze dodany, dodaj go
      if (actor && !selectedActors.some((a) => a.personId === actor.personId)) {
        setSelectedActors((prev) => [...prev, actor]);
      }
    }

    // Zresetuj pole wyszukiwania
    setActorName("");
  };

  const handleDirectorSearch = () => {
    // Połącz imiona i nazwiska reżyserów w jeden ciąg, aby dopasować do directorName
    const directorNames = directorData.map(
      (d) => `${d.firstName} ${d.lastName}`
    );

    console.log("Reżyserowie tutaj:", directorNames);

    // Znajdź najlepsze dopasowanie
    const { bestMatch } = stringSimilarity.findBestMatch(
      directorName.toLowerCase(),
      directorNames.map((name) => name.toLowerCase())
    );

    // Sprawdź, czy wynik jest wystarczająco podobny (ustaw próg, np. 0.7)
    if (bestMatch.rating >= rateThreShold) {
      const director = directorData.find(
        (d) => `${d.firstName} ${d.lastName}`.toLowerCase() === bestMatch.target
      );

      // Jeśli reżyser istnieje i nie jest jeszcze dodany, dodaj go
      if (
        director &&
        !selectedDirectors.some((d) => d.directorId === director.directorId)
      ) {
        setSelectedDirectors((prev) => [...prev, director]);
      }
    }

    // Zresetuj pole wyszukiwania
    setDirectorName("");
  };

  const handleDelete = (id: string, type: string) => {
    if (type === "actor") {
      setSelectedActors((prev) => prev.filter((a) => a.personId !== id));
    } else if (type === "director") {
      setSelectedDirectors((prev) => prev.filter((d) => d.directorId !== id));
    }
  };

  return (
    <div className="container justify-content-center align-items-top p-2">
      {/* Przyciski */}
      <div className="d-flex mb-2 justify-content-center">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "primary" : "light"}
            onClick={() => handleTabClick(tab.key)}
            className="me-2"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Gatunki i Kraje */}
      {["gatunki", "kraje"].includes(activeTab || "") && (
        <div
          className="checkbox-list"
          style={{
            maxHeight: "300px",
            height: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <Row className="mx-1">
            {dataToShow.map((item, index) => (
              <Col key={index} md={4} className="mb-2">
                <Form.Check
                  type="checkbox"
                  id={`${item.name}`}
                  className="text-white text-start"
                  label={item.name}
                  checked={
                    activeTab === "gatunki"
                      ? selectedCategories.includes(item.name)
                      : activeTab === "kraje"
                      ? selectedCountries.includes(item.name)
                      : false
                  }
                  onChange={(e) =>
                    handleCheckboxChange(
                      item.name,
                      e.target.checked,
                      activeTab === "gatunki" ? "gatunki" : "kraje"
                    )
                  }
                />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Aktorzy */}
      {activeTab === "aktorzy" && (
        <div className="justify-content-center">
          <div className="d-flex justify-content-center align-items-center w-100">
            <Form.Control
              className="w-50 me-2"
              type="text"
              placeholder="Podaj imię i nazwisko aktora"
              value={actorName}
              onChange={(e) => setActorName(e.target.value)}
              style={{
                textAlign: "center", // Tekst w inputcie wyśrodkowany
              }}
            />
            <Button
              variant="success"
              onClick={handleActorSearch}
              style={{
                whiteSpace: "nowrap", // Przyciski nie rozciągają się
              }}
            >
              Dodaj aktora
            </Button>
          </div>
          <div
            className="container text-center mt-3 border border-light-subtle rounded"
            style={{ minHeight: "260px" }}
          >
            <div className="row row-cols-auto">
              {selectedActors.map((actor) => (
                <div
                  key={actor.personId}
                  className="col bg-light m-1 p-1 rounded"
                >
                  {actor.firstName} {actor.lastName}{" "}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => handleDelete(actor.personId, "actor")}
                  ></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reżyserzy */}
      {activeTab === "rezyszerzy" && (
        <div className="justify-content-center">
          <div className="d-flex justify-content-center align-items-center w-100">
            <Form.Control
              className="w-50 me-2"
              type="text"
              placeholder="Podaj imię i nazwisko reżysera"
              value={directorName}
              onChange={(e) => setDirectorName(e.target.value)}
              style={{
                textAlign: "center", // Wyśrodkowanie tekstu w inputcie
              }}
            />
            <Button
              variant="success"
              onClick={handleDirectorSearch}
              style={{
                whiteSpace: "nowrap", // Uniknięcie rozciągania przycisku
              }}
            >
              Dodaj reżysera
            </Button>
          </div>
          <div
            className="container text-center mt-3 border border-light-subtle rounded"
            style={{ minHeight: "260px" }}
          >
            <div className="row row-cols-auto">
              {selectedDirectors.map((director) => (
                <div
                  key={director.directorId}
                  className="col bg-light m-1 p-1 rounded"
                >
                  {director.firstName} {director.lastName}{" "}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() =>
                      handleDelete(director.directorId, "director")
                    }
                  ></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterMovieModule;
