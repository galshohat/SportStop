import React, { useState, useEffect, useContext } from "react";
import MainImageUploadButton from "../../Components/Images/MainImageUploadButton";
import AdditionalImagesUploadButton from "../../Components/Images/AdditionalImagesUploadButton";
import ImagePreview from "../../Components/Images/ImagePreview";
import Loading from "../../../Loader/Loader";
import { AuthContext } from "../../../Auth&Verify/UserAuth";
import "./FormStyles.css";

import {
  fetchCategories,
  fetchSizes,
  fetchColors,
} from "./Functions/fetchData";
import {
  handleCategoryChange,
  handleSizeChange,
  handleColorChange,
} from "./Functions/formHandlers";
import {
  handleMainImageUpload,
  handleAdditionalImagesUpload,
  handleDeleteMainImage,
  handleDeleteAdditionalImage,
} from "./Functions/imageHandlers";

const AddProductForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSizeIds, setSelectedSizeIds] = useState([]);
  const [colorsList, setColorsList] = useState([]);
  const [selectedColorIds, setSelectedColorIds] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [price, setPrice] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [stockAmount, setStockAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currency = useContext(AuthContext).userInfo.currency
  const [selectedGenders, setSelectedGenders] = useState([]);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      await fetchCategories(setCategories);
      await fetchSizes(setSizes, setLoading);
      await fetchColors(setColorsList, setLoading);


      setLoading(false);
    };

    fetchData();
  }, []);

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setSelectedGenders((prev) =>
      prev.includes(value)
        ? prev.filter((gender) => gender !== value)
        : [...prev, value]
    );
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mainImage) {
      setError("Main image is required.");
      return;
    }
    if (selectedCategoryIds.length === 0) {
      setError("At least one category is required.");
      return;
    }
    if (selectedGenders.length === 0) {
      setError("At least one gender must be selected.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categories", selectedCategoryIds.join(","));
    formData.append("sizes", selectedSizeIds.join(","));
    formData.append("colors", selectedColorIds.join(","));
    formData.append("featured", featured);
    formData.append("price", price);
    formData.append("stockAmount", stockAmount);
    formData.append("description", description);
    formData.append("gender", selectedGenders.join(","));
    formData.append("mainImage", mainImage);

    additionalImages.forEach((image) => {
      formData.append("additionalImages", image);
    });

    onSubmit(formData);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <MainImageUploadButton
            handleMainImageUpload={(e) =>
              handleMainImageUpload(e, setMainImage, setError)
            }
          />
          <AdditionalImagesUploadButton
            handleAdditionalImagesUpload={(e) =>
              handleAdditionalImagesUpload(
                e,
                additionalImages,
                setAdditionalImages
              )
            }
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <ImagePreview
          mainImage={mainImage}
          additionalImages={additionalImages}
          onDeleteMainImage={() => handleDeleteMainImage(setMainImage)}
          onDeleteAdditionalImage={(index) =>
            handleDeleteAdditionalImage(
              index,
              additionalImages,
              setAdditionalImages
            )
          }
        />

        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
              id="name"
              placeholder=" "
            />
            <label htmlFor="name" className="form-label">
              Name
            </label>
          </div>

          <div className="form-group">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="form-input"
              id="price"
              placeholder=" "
            />
            <label htmlFor="price" className="form-label">
              Price ({currency})
            </label>
          </div>

          <div className="form-group">
            <div className="form-category-container">
              <label htmlFor="categories" className="checkbox-label-class">
                Categories
              </label>
              <div className="category-scrollbox">
                {categories.map((category) => (
                  <label key={category._id} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={category._id}
                      checked={selectedCategoryIds.includes(category._id)}
                      onChange={(e) =>
                        handleCategoryChange(
                          e,
                          categories,
                          setSelectedCategoryIds,
                          setError
                        )
                      }
                      className="checkbox-input"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <div className="form-category-container">
              <label htmlFor="sizes" className="checkbox-label-class">
                Sizes
              </label>
              <div className="category-scrollbox">
                {sizes.map((size) => (
                  <label key={size._id} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={size._id}
                      checked={selectedSizeIds.includes(size._id)}
                      onChange={(e) =>
                        handleSizeChange(e, sizes, setSelectedSizeIds)
                      }
                      className="checkbox-input"
                    />
                    {size.value}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="form-category-container">
              <label htmlFor="colors" className="checkbox-label-class">
                Colors
              </label>
              <div className="category-scrollbox">
                {colorsList.map((color) => (
                  <label key={color._id} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={color._id}
                      checked={selectedColorIds.includes(color._id)}
                      onChange={(e) =>
                        handleColorChange(e, colorsList, setSelectedColorIds)
                      }
                      className="checkbox-input"
                    />
                    {color.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <input
              type="number"
              value={stockAmount}
              onChange={(e) => setStockAmount(e.target.value)}
              required
              className="form-input"
              id="stockAmount"
              placeholder=" "
              min="0"
              max="5000"
            />
            <label htmlFor="stockAmount" className="form-label">
              Stock Amount (Max 5000)
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-input"
              id="description"
              placeholder=" "
              maxLength="250"
              rows="4"
              style={{ resize: "none", paddingBottom:"1vh", paddingTop:"2vh"}}
            ></textarea>
            <label htmlFor="description" className="form-label">
              Description (Max 250)
            </label>
          </div>
          <div className="form-group">
            <div className="form-category-container">
              <label htmlFor="gender" className="checkbox-label-class">
                Gender
              </label>
              <div className="category-scrollbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Men"
                    checked={selectedGenders.includes("Men")}
                    onChange={handleGenderChange}
                    className="checkbox-input"
                  />
                  Men
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="Women"
                    checked={selectedGenders.includes("Women")}
                    onChange={handleGenderChange}
                    className="checkbox-input"
                  />
                  Women
                </label>
              </div>
            </div>
          </div>

          <div className="form-checkbox-group">
            <label htmlFor="featured" className="form-checkbox-label">
              Featured
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked ? true : false)}
                className="form-checkbox"
                id="featured"
              />
            </label>
            <span className="form-checkbox-message">
              The product will appear on the home page
            </span>
          </div>
        </div>

        <div className="form-submit-container">
          <button
            type="submit"
            className="create-btn"
            disabled={
              !name ||
              !price ||
              !mainImage ||
              !selectedCategoryIds.length ||
              !selectedGenders.length ||
              !stockAmount ||
              !description
            }
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
