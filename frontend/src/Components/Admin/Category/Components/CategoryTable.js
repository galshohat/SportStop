import React, { useEffect } from 'react';
import { Delete } from '@mui/icons-material';
import formatDate from "../../../Helpers/FormatDate";
import { highlightRows } from "../../Functions/highlightRows"; 

const CategoryTable = ({
  currentCategories,
  confirmUpdateCategory,
  confirmDeleteCategory,
  highlightedCategoryIds, 
  onHighlightComplete 
}) => {

  useEffect(() => {
    const cleanup = highlightRows(highlightedCategoryIds, currentCategories, onHighlightComplete, "category");
    

    return cleanup;
  }, [highlightedCategoryIds, currentCategories, onHighlightComplete]);

  return (
    <table className="category-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Number Of Products</th> 
          <th>Last Modified</th>
          <th>Actions</th> 
        </tr>
      </thead>
      <tbody>
        {currentCategories.map((category, index) => (
          <tr
            key={category.id}
            id={`category-${category.id}`}
            className={
              Array.isArray(highlightedCategoryIds) && highlightedCategoryIds.includes(category.id)
                ? "highlighted-row"
                : ""
            }
          >
            <td>{category.name}</td>
            <td>{category.productCount}</td>
            <td>{formatDate(category.dateModified)}</td>
            <td className="action-buttons-cell">
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => confirmUpdateCategory(category)}
                >
                  ...
                </button>
                <Delete
                  className="delete-icon"
                  onClick={() => confirmDeleteCategory(category)}
                  style={{
                    color: "red",
                    cursor: "pointer",
                    marginLeft: "0.25vw",
                    marginTop:"1vh"
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;