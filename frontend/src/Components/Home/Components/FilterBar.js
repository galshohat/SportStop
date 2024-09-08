import React, { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const FilterBar = ({ filters, setFilters, availableFilters }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(filters);


  const handleFilterClick = (filterType) => {
    setActiveFilter(filterType === activeFilter ? null : filterType);
  };

  const handleSelectOption = (filterType, option) => {
    const newFilters = { ...selectedFilters };
    if (option === "None") {
      delete newFilters[filterType];
      setActiveFilter(null);
    } else {
      if (newFilters[filterType]?.includes(option)) {
        newFilters[filterType] = newFilters[filterType].filter(
          (item) => item !== option
        );
        if (newFilters[filterType].length === 0) {
          delete newFilters[filterType];
        }
      } else {
        newFilters[filterType] = [
          ...(newFilters[filterType] || []),
          option,
        ];
      }
    }
    setSelectedFilters(newFilters);
    setFilters(newFilters);
  };

  const renderFilterText = (filterType, options) => {
    return `${filterType}: ${options.join(", ")}`;
  };

  return (
    <div className="filter-home-bar">
      <div className="filter-home-header">
        <span className="filter-header-text">Apply filters:</span>
        <div className="filter-home-buttons">
          {["Colors", "Sizes", "Categories", "Gender"].map((filterType) => (
            <button
              key={filterType}
              className={`filter-home-btn ${
                activeFilter === filterType ? "active" : ""
              }`}
              onClick={() => handleFilterClick(filterType)}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>
      {activeFilter && (
        <div className="filter-home-options">
          <div className="scrollbar">
            <button
              className="filter-home-option"
              onClick={() => handleSelectOption(activeFilter, "None")}
            >
              None
            </button>
            {availableFilters[activeFilter]?.map((option) => (
              <button
                key={option}
                className={`filter-home-option ${
                  selectedFilters[activeFilter]?.includes(option)
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleSelectOption(activeFilter, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="selected-filters">
        {Object.entries(selectedFilters).map(([filterType, options]) => (
          <div className="filter-tag" key={filterType}>
            <FilterAltIcon style={{ marginRight: "0.5vw" }} />
            <span>{renderFilterText(filterType, options)}</span>
            <button
              onClick={() => handleSelectOption(filterType, "None")}
              style={{ color: "red" }}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;