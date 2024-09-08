import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FilterBarVertical from "./Components/FilterBarVertical";
import ProductCard from "../Home/Components/ProductCard";
import Popup from "../Helpers/PopUp/PopUp";
import "./SearchResults.css";
import Navbar from "../Navbar/Navbar";
import ProductPopup from "../Product-Profile/ProductPopup"; 

const SearchResults = () => {
  const location = useLocation();
  const { foundProducts, availableFilters, searchText } = location.state || {};
  const [filteredProducts, setFilteredProducts] = useState(foundProducts || []);
  const [filters, setFilters] = useState({});
  const [errorMessage, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });
  
  useEffect(() => {
    if (!foundProducts) {
      setFilteredProducts([]);
    }
  }, [foundProducts]);

  const applyFilters = (products, filters) => {
    return products.filter((product) => {
      const matchesColors =
        !filters.Colors ||
        filters.Colors.some((color) =>
          product.colors.some((prodColor) => prodColor.name === color)
        );
      const matchesSizes =
        !filters.Sizes ||
        filters.Sizes.some((size) =>
          product.sizes.some((prodSize) => prodSize.name === size)
        );
      const matchesCategories =
        !filters.Categories ||
        filters.Categories.some((category) =>
          product.categories.some(
            (prodCategory) => prodCategory.name === category
          )
        );
      const matchesGender =
        !filters.Gender || filters.Gender.includes(product.gender);

      return (
        matchesColors && matchesSizes && matchesCategories && matchesGender
      );
    });
  };

  useEffect(() => {
    const updatedProducts = applyFilters(foundProducts || [], filters);
    setFilteredProducts(updatedProducts);
  }, [filters, foundProducts]);

  const handleViewProduct = (product, ErrorMessage) => {
    setSelectedProduct(product);
    if (ErrorMessage) {
      setError(ErrorMessage);
    }
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const handleCloseNotification = () => {
    setNotification({ visible: false, message: "" });
  };

  const renderSelectedFilters = () => (
    <div className="selected-filters">
      {Object.entries(filters).map(([filterType, options]) => (
        <div key={filterType} className="filter-tag">
          <span>
            {filterType}: {options.join(", ")}
          </span>
          <button
            onClick={() => handleRemoveFilter(filterType)}
            style={{ color: "red" }}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );

  const handleRemoveFilter = (filterType) => {
    const newFilters = { ...filters };
    delete newFilters[filterType];
    setFilters(newFilters);
  };

  return (
    <div className="search-results-container">
      <Navbar />
      <aside className="filters-section">
        <FilterBarVertical
          filters={filters}
          setFilters={setFilters}
          availableFilters={availableFilters}
        />
      </aside>

      <main className="products-section-container">
        <div className="results-summary">
          <h2>
            Results For: "{searchText || ""}"&nbsp;&nbsp;&nbsp;
            <span className="results-count">
              Number of results: {filteredProducts.length}
            </span>
          </h2>
        </div>
        {renderSelectedFilters()}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewProduct={handleViewProduct}
              showNotification={(message) =>
                setNotification({ visible: true, message })
              }
            />
          ))}
        </div>
      </main>

      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={handleClosePopup}
          ErrorMessage={errorMessage}
          showNotification={(message) =>
            setNotification({ visible: true, message })
          }
        />
      )}

      {notification.visible && (
        <Popup
          onClose={handleCloseNotification}
          title="Notification"
          buttonText="Close"
        >
          <p
            style={{
              fontSize: "1.2rem",
              color: notification.message.includes("Quantity updated")
                ? "red"
                : "black",
              fontWeight: "bold",
            }}
          >
            {notification.message}
          </p>
        </Popup>
      )}
    </div>
  );
};

export default SearchResults;