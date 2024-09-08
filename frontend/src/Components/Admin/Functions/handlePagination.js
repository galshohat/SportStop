const handlePreviousPage = (currentPage, setCurrentPage) => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
};

const handleNextPage = (currentPage, setCurrentPage, totalPages) => {
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
    }
};

export { handlePreviousPage, handleNextPage };