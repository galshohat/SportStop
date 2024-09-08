import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar.js";
import "./Home.css";
import Header from "./Components/Header.js";
import CategorySlide from "./Components/CategorySlide";
import homePageImage from "../../home-screen.png";
import FilterBar from "./Components/FilterBar";
import ProductPopup from "../Product-Profile/ProductPopup.js";
import Popup from "../Helpers/PopUp/PopUp.js";
import Loading from "../Loader/Loader";
import fetchProducts from "../Admin/Product/Functions/fetchProducts";
import fetchCategories from "../Admin/Category/Functions/fetchCategories";
import fetchColors from "../Admin/Color/Functions/fetchColors";
import fetchSizes from "../Admin/Size/Functions/fetchSizes";
import SessionExpiryRedirect from "../Auth&Verify/SessionExpiryRedirect.js";
import { DataContext } from "../Auth&Verify/DataContext.js";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { loading } = useContext(DataContext);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState({});
  const [loader, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchProducts(setProducts, setLoading, true);
        await fetchCategories(setCategories, setLoading);
        await fetchColors(setColors, setLoading);
        await fetchSizes(setSizes, setLoading);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyFilters = (products, filters) => {
    return products.filter((product) => {
      const isFeatured = product.isFeatured || false;

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
        isFeatured &&
        matchesColors &&
        matchesSizes &&
        matchesCategories &&
        matchesGender
      );
    });
  };

  const filteredProducts = applyFilters(products, filters);

  const filteredCategories = categories.filter((category) =>
    filteredProducts.some((product) =>
      product.categories.some((cat) => cat.id === category.id)
    )
  );

  const groupedCategories = [];
  for (let i = 0; i < filteredCategories.length; i += 2) {
    groupedCategories.push(filteredCategories.slice(i, i + 2));
  }

  const availableFilters = {
    Colors: colors.map((color) => color.name),
    Sizes: sizes.map((size) => size.name),
    Categories: categories.map((category) => category.name),
    Gender: ["Men", "Women"],
  };

  const handleViewProduct = (product, ErrorMessage) => {
    setSelectedProduct(product);
    if (ErrorMessage) setErrorMessage(ErrorMessage);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const showNotification = (message) => {
    setNotification({ visible: true, message });
  };

  const handleCloseNotification = () => {
    setNotification({ visible: false, message: "" });
  };

  if (loader || loading) {
    return <Loading />;
  }

  return (
    <div>
      <Navbar />
      <div className="loading-container"></div>
      <>
        <div className="home-image-container">
          <img
            src={homePageImage}
            alt="Home Page"
            className="home-page-image"
          />
        </div>
        <Header text="Check out the featured products" />

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          availableFilters={availableFilters}
        />

        <div className="categories-container">
          {groupedCategories.map((categoryPair, index) => (
            <div className="category-row" key={index}>
              {categoryPair.map((category) => {
                const categoryProducts = filteredProducts.filter((product) =>
                  product.categories.some((cat) => cat.id === category.id)
                );

                return (
                  <CategorySlide
                    key={category.id}
                    category={category}
                    products={categoryProducts}
                    onViewProduct={handleViewProduct}
                    showNotification={showNotification}
                    setSessionExpired={setSessionExpired}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </>

      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={handleClosePopup}
          ErrorMessage={errorMessage}
          showNotification={showNotification}
          setSessionExpired={setSessionExpired}
        />
      )}

      {notification.visible && (
        <Popup
          onClose={() => {
            if (
              notification.message === "You must log in before adding to cart"
            ) {
              navigate("/auth");
            } else {
              handleCloseNotification();
            }
          }}
          title="Notification"
          buttonText={
            notification.message === "You must log in before adding to cart"
              ? "Redirect to login"
              : "Close"
          }
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

      {sessionExpired && <SessionExpiryRedirect trigger={sessionExpired} />}
    </div>
  );
};

export default Home;
