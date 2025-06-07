import { useState, useEffect } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { Category } from "../../models/Category";
import { Country } from "../../models/Country";
import { Person } from "../../models/Person";
import { fetchAllCategories } from "../../API/CategoriesAPI";
import { fetchAllCountries } from "../../API/CountriesAPI";
import { fetchByPersonSearchAndRoleNoPgnt } from "../../API/personApi";

interface Props {
  // Pobranie Kategori jako string[], Krajów jako string[], Aktorów jako string[], Reżyserów jako string[]
  getFilters: (list: [string[], string[], string[], string[]]) => void;
}


const FilterMovieModule = ({ getFilters }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [countryData, setCountryData] = useState<Country[]>([]);

  const [dataToShow, setDataToShow] = useState<Country[] | Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const [actorName, setActorName] = useState<string>("");
  const [selectedActors, setSelectedActors] = useState<Person[]>([]);

  const [directorName, setDirectorName] = useState<string>("");
  const [selectedDirectors, setSelectedDirectors] = useState<Person[]>([]);

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

  // Pobranie wszystkich kategorii i krajów
  useEffect(() => {
    fetchAllCategories(setCategoryData);
    fetchAllCountries(setCountryData);
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

  const handleActorSearch = async() => {
    const response = await fetchByPersonSearchAndRoleNoPgnt(actorName, 1);
    if (response.length === 0) return;

    // Znajdź pierwszego aktora, którego nie ma w selectedActors
    const actorToAdd = response.find(
      (actor) =>
        !selectedActors.some((selectedActor) => selectedActor.personId === actor.personId)
    );

    if (actorToAdd) {
      setSelectedActors((prev) => [...prev, actorToAdd]);
      setActorName("");
    } else {
      // Wszyscy znalezieni aktorzy są już na liście
      console.log("Wszyscy znalezieni aktorzy są już dodani.");
      // Możesz też ustawić komunikat dla użytkownika:
      // setError("Wszyscy pasujący aktorzy są już dodani.");
    }
  };

  const handleDirectorSearch = async () => {
    const response = await fetchByPersonSearchAndRoleNoPgnt(directorName, 0);
    if (response.length === 0) return;

    // Znajdź pierwszego aktora, którego nie ma w selectedActors
    const directorToAdd = response.find(
      (director) =>
        !selectedActors.some(
          (selectedDirector) => selectedDirector.personId === director.personId
        )
    );

    if (directorToAdd) {
      setSelectedDirectors((prev) => [...prev, directorToAdd]);
      setDirectorName("");
    } else {
      // Wszyscy znalezieni aktorzy są już na liście
      console.log("Wszyscy znalezieni aktorzy są już dodani.");
      // Możesz też ustawić komunikat dla użytkownika:
      // setError("Wszyscy pasujący reżyserzy są już dodani.");
    }
  };

  const handleDelete = (id: string, type: string) => {
    if (type === "actor") {
      setSelectedActors((prev) => prev.filter((a) => a.personId !== id));
    } else if (type === "director") {
      setSelectedDirectors((prev) => prev.filter((d) => d.personId !== id));
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
                  key={director.personId}
                  className="col bg-light m-1 p-1 rounded"
                >
                  {director.firstName} {director.lastName}{" "}
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() =>
                      handleDelete(director.personId, "director")
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
