const highlightMatch = (text, query) => {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const startIndex = lowerText.indexOf(lowerQuery);
  
    if (startIndex === -1) {
      return text;
    }
  
    const beforeMatch = text.slice(0, startIndex);
    const match = text.slice(startIndex, startIndex + query.length);
    const afterMatch = text.slice(startIndex + query.length);
  
    const highlightedText = `${beforeMatch}<strong>${match}</strong>${afterMatch}`;
  
    return highlightedText;
  };
  
const SearchProducts = async (query, products, categories) => {
  try {
    const productsArray = Array.isArray(products) ? products : [];
    const categoriesArray = Array.isArray(categories) ? categories : [];

    const filteredProducts = productsArray.filter((product) => {
      const { name, description, categories, colors, countStock } = product;
      if (countStock <= 0) return false;
      const searchText = `${name} ${description} ${categories
        .map((cat) => cat.name)
        .join(" ")} ${colors
        .map((color) => color.name)
        .join(" ")}`.toLowerCase();
      return searchText.includes(query.toLowerCase());
    });

    const highlightedProducts = filteredProducts.map((product) => {
      const highlightedName = highlightMatch(product.name, query);
      return { ...product, highlightedName };
    });
      
    return { products: highlightedProducts, categories: categoriesArray };
  } catch (error) {
    console.error("Error during product search:", error);
    return { products: [], categories: [] };
  } 
};

export default SearchProducts;
