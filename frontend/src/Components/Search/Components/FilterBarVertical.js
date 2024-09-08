import React, { useState, useEffect } from "react";

const FilterBarVertical = ({ filters, setFilters, availableFilters }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(filters);

  useEffect(() => {
    setSelectedFilters(filters);
  }, [filters]);

  const handleFilterClick = (filterType) => {
    setActiveFilter((prevActiveFilter) =>
      prevActiveFilter === filterType ? null : filterType
    );
  };

  const handleSelectOption = (filterType, option) => {
    const newFilters = { ...selectedFilters };

    if (option === "None") {
      delete newFilters[filterType];
    } else {
      if (newFilters[filterType]?.includes(option)) {
        newFilters[filterType] = newFilters[filterType].filter(
          (item) => item !== option
        );
        if (newFilters[filterType].length === 0) {
          delete newFilters[filterType];
        }
      } else {
        newFilters[filterType] = newFilters[filterType]
          ? [...newFilters[filterType], option]
          : [option];
      }
    }

    setSelectedFilters(newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="vertical-filter-bar">
      {Object.keys(availableFilters).map((filterType) => (
        <React.Fragment key={filterType}>
          <div className="filter-section">
            <button
              className={`filter-btn ${
                activeFilter === filterType ? "active" : ""
              }`}
              onClick={() => handleFilterClick(filterType)}
              style={{ pointerEvents: "auto" }}
            >
              {filterType}
            </button>
            <div
              className={`filter-options ${
                activeFilter === filterType ? "expanded" : ""
              } ${
                availableFilters[filterType].length > 10
                  ? "three-column-grid"
                  : "two-column-grid"
              }`}
            >
              <button
                className="filter-option none-btn"
                onClick={() => handleSelectOption(filterType, "None")}
              >
                None
              </button>
              {availableFilters[filterType].map((option) => (
                <button
                  key={option}
                  className={`filter-option ${
                    selectedFilters[filterType]?.includes(option)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleSelectOption(filterType, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-divider"></div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default FilterBarVertical;