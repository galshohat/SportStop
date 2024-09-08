import React, { createContext, useState, useEffect, useContext } from "react";
import fetchProducts from "../Admin/Product/Functions/fetchProducts";
import fetchCategories from "../Admin/Category/Functions/fetchCategories";
import fetchColors from "../Admin/Color/Functions/fetchColors";
import fetchSizes from "../Admin/Size/Functions/fetchSizes";
import Loading from "../Loader/Loader";
import { AuthContext } from "./UserAuth";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loader } = useContext(AuthContext);

  useEffect(() => {
    while (loader) {}
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

  if (loading) {
    return <Loading />;
  }

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        colors,
        sizes,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
