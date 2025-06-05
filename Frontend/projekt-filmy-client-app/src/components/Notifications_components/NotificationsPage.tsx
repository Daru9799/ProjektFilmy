const NotificationPage = () => {

  return (
    <div className="container my-4">
      <h2 className="mb-4" style={{ color: "white" }}>
        Powiadomienia:
      </h2>
      {/* Komponent paginacji */}
      {/* <PaginationModule
        currentPage={pagination.pageNumber}
        totalPages={pagination.totalPages}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, pageNumber: page }))
        }
      /> */}
    </div>
  );
};

export default NotificationPage;