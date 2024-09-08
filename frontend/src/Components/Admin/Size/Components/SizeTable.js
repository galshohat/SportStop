import React, { useEffect } from 'react';
import { Delete } from '@mui/icons-material';
import formatDate from "../../../Helpers/FormatDate";
import { highlightRows } from "../../Functions/highlightRows"; 

const SizeTable = ({
  currentSizes,
  confirmUpdateSize,
  confirmDeleteSize,
  highlightedSizeIds,
  onHighlightComplete
}) => {

  useEffect(() => {
    const cleanup = highlightRows(highlightedSizeIds, currentSizes, onHighlightComplete, "size");
    
    return cleanup;
  }, [highlightedSizeIds, currentSizes, onHighlightComplete]);

  return (
    <table className="category-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
          <th>Last Modified</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentSizes.map((size) => (
          <tr
            key={size.id}
            id={`size-${size.id}`}
            className={
              Array.isArray(highlightedSizeIds) && highlightedSizeIds.includes(size.id)
                ? "highlighted-row"
                : ""
            }
          >
            <td>{size.name}</td>
            <td>{size.value}</td>
            <td>{formatDate(size.dateModified)}</td>
            <td className="action-buttons-cell">
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => confirmUpdateSize(size)}
                >
                  ...
                </button>
                <Delete
                  className="delete-icon"
                  onClick={() => confirmDeleteSize(size)}
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

export default SizeTable;