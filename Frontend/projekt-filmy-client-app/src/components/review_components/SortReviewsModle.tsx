import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const SortReviewModule: React.FC<{ onSort: (category: string) => void }> = ({ onSort }) => {
  const [selectedOption, setSelectedOption] = useState<string>("Ocena: Najwyższa");

  const handleSort = () => {
    onSort(selectedOption);
  };

  return (
    <Container>
      <Row className="justify-content-left">
        <Col xs={12} md={6}>
          <Form className="d-flex">
            <Form.Group controlId="sortSelect" className="flex-grow-2">
              <Form.Control
                as="select"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="form-control-sm" // Mniejsza szerokość selecta
                style={{ marginTop: "2px" }}
              >
                <option value="highRaiting">Ocena: Najwyższa</option>
                <option value="lowRaiting">Ocena: Najniższa</option>
                <option value="new">Data recenzji: Najnowsze</option>
                <option value="old">Data recenzji: Najstarsze</option>
              </Form.Control>
            </Form.Group>
            <Button
              variant="primary"
              className="ml-3 mt-md-0 h-50 p-1"
              onClick={handleSort}
              style={{ flexShrink: 0 }} // Zapewnia, że guzik nie będzie zmieniał rozmiaru
            >
              Sortuj
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SortReviewModule;
