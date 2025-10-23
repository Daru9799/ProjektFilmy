import { useState, useEffect } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { Person } from "../../models/Person";
import { useCategories } from "../../API/CategoriesApi";
import { useCountries } from "../../API/CountriesApi";
import { usePeopleByRoleNoPgnt } from "../../API/PersonApi";
import SpinnerLoader from "../SpinnerLoader" 
import ApiErrorDisplay from "../ApiErrorDisplay";

interface Props {
  // Pobranie Kategori jako string[], Krajów jako string[], Aktorów jako string[], Reżyserów jako string[]
  getFilters: (list: [string[], string[], string[], string[]]) => void;
}

const FilterMovieModule = ({ getFilters }: Props) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const [actorName, setActorName] = useState<string>("");
  const [selectedActors, setSelectedActors] = useState<Person[]>([]);

  const [directorName, setDirectorName] = useState<string>("");
  const [selectedDirectors, setSelectedDirectors] = useState<Person[]>([]);

  // -------------------
  // API hooks
  // -------------------
  const { data: categoryData = [], isLoading: loadingCategories, apiError: categoriesError } = useCategories();
  const { data: countryData = [], isLoading: loadingCountries, apiError: countriesError} = useCountries();
  const { data: allActors = [] } = usePeopleByRoleNoPgnt(1, actorName);
  const { data: allDirectors = [] } = usePeopleByRoleNoPgnt(0, directorName);

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
    
  }, [selectedCategories, selectedCountries, selectedActors, selectedDirectors]);

  const tabs = [
    { key: "gatunki", label: "Gatunki" },
    { key: "kraje", label: "Kraje" },
    { key: "rezyszerzy", label: "Reżyserzy" },
    { key: "aktorzy", label: "Aktorzy" },
  ];

  const handleTabClick = (tabKey: string) => {
    if (activeTab === tabKey) {
      setActiveTab(null);
    } else {
      setActiveTab(tabKey);
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
    const actorToAdd = allActors.find(
      (actor) => !selectedActors.some((selected) => selected.personId === actor.personId)
    );

    if (actorToAdd) {
      setSelectedActors((prev) => [...prev, actorToAdd]);
      setActorName("");
    } else {
      // Wszyscy znalezieni aktorzy są już na liście (komunikat?)
      console.log("Wszyscy znalezieni aktorzy są już dodani.");
    }
  };

  const handleDirectorSearch = async () => {
    const directorToAdd = allDirectors.find(
      (director) => !selectedDirectors.some((selected) => selected.personId === director.personId)
    );

    if (directorToAdd) {
      setSelectedDirectors((prev) => [...prev, directorToAdd]);
      setDirectorName("");
    } else {
      // Wszyscy znalezieni aktorzy są już na liście
      console.log("Wszyscy znalezieni aktorzy są już dodani.");
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
          className="checkbox-list overflow-auto border border-secondary p-2 rounded"
          style={{ maxHeight: '300px', height: '300px' }}
        >
          
          {activeTab === "gatunki" && loadingCategories && <SpinnerLoader />}
          {activeTab === "kraje" && loadingCountries && <SpinnerLoader />}
          
          {activeTab === "gatunki" && !loadingCategories && (
            <ApiErrorDisplay apiError={categoriesError}>
              <Row className="mx-1">
                {categoryData.map((item) => (
                  <Col key={item.name} md={4} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={item.name}
                      className="text-white text-start"
                      label={item.name}
                      checked={selectedCategories.includes(item.name)}
                      onChange={(e) => handleCheckboxChange(item.name, e.target.checked, "gatunki")}
                    />
                  </Col>
                ))}
              </Row>
            </ApiErrorDisplay>
          )}

          {activeTab === "kraje" && !loadingCountries && (
            <ApiErrorDisplay apiError={countriesError}>
              <Row className="mx-1">
                {countryData.map((item) => (
                  <Col key={item.name} md={4} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={item.name}
                      className="text-white text-start"
                      label={item.name}
                      checked={selectedCountries.includes(item.name)}
                      onChange={(e) => handleCheckboxChange(item.name, e.target.checked, "kraje")}
                    />
                  </Col>
                ))}
              </Row>
            </ApiErrorDisplay>
          )}
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