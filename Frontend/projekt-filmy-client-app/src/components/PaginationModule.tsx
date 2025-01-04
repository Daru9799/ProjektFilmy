import React from "react";
import Pagination from "react-bootstrap/Pagination";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // Funkcja obsługująca zmianę strony
}

const PaginationModule = ({currentPage,totalPages,onPageChange,}:Props) => {
  // Funkcja generująca elementy paginacji
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Liczba stron widocznych na raz
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => onPageChange(1)}>
          {1}
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="container d-flex justify-content-center">
      <Pagination>
        <Pagination.First
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        />
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        />
        {generatePaginationItems()}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
        <Pagination.Last
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        />
      </Pagination>
    </div>
  );
};

export default PaginationModule;
