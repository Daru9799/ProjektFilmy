import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { NotificationType } from "../../models/NotificationType";

type SortOption = "date-desc" | "date-asc" | "type-asc" | "type-desc";
export type ReadFilterOption = "all" | "read" | "unread";
export type NotificationTypeFilterOption = "all" | NotificationType;

export const readFilterMap: Record<ReadFilterOption, boolean | undefined> = {
  all: undefined,
  read: true,
  unread: false,
};

const SortNotificationModule: React.FC<{
  onSort: (orderBy: "date" | "type", sortDirection: "asc" | "desc", filter?: ReadFilterOption, typeFilter?: NotificationTypeFilterOption) => void; }> = ({ onSort }) => {
  const [selectedOption, setSelectedOption] = useState<SortOption>("date-desc");
  const [selectedReadFilter, setSelectedReadFilter] = useState<ReadFilterOption>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<NotificationTypeFilterOption>("all");

  const handleSort = () => {
    const [orderBy, sortDirection] = selectedOption.split("-") as [
      "date" | "type",
      "asc" | "desc"
    ];
    onSort(orderBy, sortDirection, selectedReadFilter, selectedTypeFilter);
  };

  //Mapowanie na polski nazw
  const notificationTypeLabels: Record<NotificationType, string> = {
    Invitation: "Zaproszenia do znajomych",
    MovieRelease: "Premiery filmów",
    PersonUpdate: "Nowości od obserwowanych twórców",
    ReviewCommented: "Komentarze do recenzji",
    CollectionReviewed: "Recenzje kolekcji"
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-left align-items-center">
        <Col xs={12} md={3}>
          <Form.Control as="select" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value as SortOption)} className="form-control-sm" style={{ marginTop: "2px" }}>
            <option value="date-desc">Data: Najnowsze</option>
            <option value="date-asc">Data: Najstarsze</option>
          </Form.Control>
        </Col>

        <Col xs={12} md={3}>
          <Form.Control as="select" value={selectedReadFilter} onChange={(e) => setSelectedReadFilter(e.target.value as ReadFilterOption)} className="form-control-sm" style={{ marginTop: "2px" }}>
            <option value="all">Status odczytania: Wszystkie</option>
            <option value="unread">Status odczytania: Nieprzeczytane</option>
            <option value="read">Status odczytania: Przeczytane</option>
          </Form.Control>
        </Col>

        <Col xs={12} md={3}>
          <Form.Control
            as="select"
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value as NotificationTypeFilterOption)}
            className="form-control-sm"
            style={{ marginTop: "2px" }}
          >
            <option value="all">Wszystkie typy</option>
            {Object.values(NotificationType).map((type) => (
              <option key={type} value={type}>
                {notificationTypeLabels[type]}
              </option>
            ))}
          </Form.Control>
        </Col>

        <Col xs={12} md={1}>
          <Button variant="primary" className="ml-3 mt-md-0 h-50 p-1" onClick={handleSort} style={{ flexShrink: 0 }}>
            Zastosuj
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SortNotificationModule;