import React, { useEffect } from 'react';
import { Delete } from '@mui/icons-material';
import formatDate from "../../../Helpers/FormatDate";
import { highlightRows } from "../../Functions/highlightRows";

const ColorTable = ({
  currentColors,
  confirmUpdateColor,
  confirmDeleteColor,
  highlightedColorIds,
  onHighlightComplete
}) => {

  useEffect(() => {
    const cleanup = highlightRows(highlightedColorIds, currentColors, onHighlightComplete, "color");
    
    return cleanup;
  }, [highlightedColorIds, currentColors, onHighlightComplete]);

  return (
    <table className="category-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
          <th>View</th>
          <th>Last Modified</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentColors.map((color) => (
          <tr
            key={color.id}
            id={`color-${color.id}`}
            className={
              Array.isArray(highlightedColorIds) && highlightedColorIds.includes(color.id)
                ? "highlighted-row"
                : ""
            }
          >
            <td>{color.name}</td>
            <td>{color.value}</td>
            <td>
              <div 
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: color.value,
                  display: 'inline-block',
                  border: '1px solid #000'
                }} 
                title={color.value} 
              />
            </td>
            <td>{formatDate(color.dateModified)}</td>
            <td className="action-buttons-cell">
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => confirmUpdateColor(color)}
                >
                  ...
                </button>
                <Delete
                  className="delete-icon"
                  onClick={() => confirmDeleteColor(color)}
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

export default ColorTable;