import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({
  currentPage,
  handlePreviousPage,
  handleNextPage,
  totalPages,
  wrapperStyle,
}) => {
  return (
    <div style={wrapperStyle}>
      <div className={styles.paginationWrapper}>
        <div className={styles.pagination}>
          <button
            className={`${styles.paginationBtn} ${
              currentPage === 1 ? styles.disabled : ""
            }`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={`${styles.paginationBtn} ${
              currentPage === totalPages ? styles.disabled : ""
            }`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <div className={styles.paginationWrapper}>
        <span
          className={styles.pageInfo}
        >{`Page ${currentPage} of ${totalPages}`}</span>
      </div>
    </div>
  );
};

export default Pagination;
