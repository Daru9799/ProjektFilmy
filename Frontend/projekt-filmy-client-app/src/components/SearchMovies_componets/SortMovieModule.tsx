import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const SortMovieModule: React.FC<{ onSort: (category: string) => void }> = ({onSort}) => {
  const [selectedOption, setSelectedOption] =
    useState<string>("Ocena: Najwyższa");

  const handleSort = () => {
    onSort(selectedOption);
  };

   return (
     <Container className="mt-4">
       <Row className="justify-content-left">
         <Col xs={12} md={6}>
           <Form className="d-flex ">
             <Form.Group controlId="sortSelect" className="flex-grow-2">
               <Form.Control
                 as="select"
                 value={selectedOption}
                 onChange={(e) => setSelectedOption(e.target.value)}
                 className="form-control-sm" // Mniejsza szerokość selecta
                 style={{marginTop:"2px"}}
               >
                 <option value="Ocena: Najwyższa">Ocena: Najwyższa</option>
                 <option value="Ocena: Najniższa">Ocena: Najniższa</option>
                 <option value="Ilość recenzji: Najwięcej">
                   Ilość recenzji: Najwięcej
                 </option>
                 <option value="Ilość recenzji: Najmniej">
                   Ilość recenzji: Najmniej
                 </option>
                 <option value="Data premiery: Najnowsze">
                   Data premiery: Najnowsze
                 </option>
                 <option value="Data premiery: Najstarsze">
                   Data premiery: Najstarsze
                 </option>
                 <option value="Alfabetycznie: A-Z">Alfabetycznie: A-Z</option>
                 <option value="Alfabetycznie: Z-A">Alfabetycznie: Z-A</option>
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

export default SortMovieModule;
