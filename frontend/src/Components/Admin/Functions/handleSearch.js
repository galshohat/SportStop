const handleSearchChange = (e, setSearchTerm, setCurrentPage) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
};

export default handleSearchChange;