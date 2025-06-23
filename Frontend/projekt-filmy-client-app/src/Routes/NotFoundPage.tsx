import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-4 mb-4">
      <Row>
        <Col>
        <div style={{ minHeight: "90vh"}}>
          <h1 className="display-1 text-light">404</h1>
          <p className="lead text-light mb-4">
            Nie znaleziono strony, której szukasz.
          </p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Wróć na stronę główną
          </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;