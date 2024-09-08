export const calculateStats = (orders, products) => {
  let totalRevenue = 0;
  let totalSales = 0;
  let productsInStock = products?.length;
  let bestSellerProduct = "N/A";
  let bestSellerCategory = "N/A";
  let recentOrders = 0;
  let CouponsConsumed = 0;
  const currentMonth = new Date().getMonth();
  const productFrequency = {};
  const categoryFrequency = {};

  orders.forEach((order) => {
    totalRevenue += order.orderPrice;
    totalSales += 1;
    if (order.discount !== "N/A") CouponsConsumed += 1;
    const date = new Date(order.orderDate);
    recentOrders += date.getMonth() === currentMonth ? 1 : 0;

    order.orderItems.forEach((item) => {

      productFrequency[item.product.name] =
        (productFrequency[item.product.name] || 0) + item.quantity;

      item.product.categories.forEach((category) => {
        categoryFrequency[category] =
          (categoryFrequency[category] || 0) + item.quantity;
      });
    });
  });


  bestSellerProduct = Object.keys(productFrequency).reduce(
    (a, b) => (productFrequency[a] > productFrequency[b] ? a : b),
    bestSellerProduct
  );

  bestSellerCategory = Object.keys(categoryFrequency).reduce(
    (a, b) => (categoryFrequency[a] > categoryFrequency[b] ? a : b),
    bestSellerCategory
  );

  return {
    totalRevenue,
    totalSales,
    productsInStock,
    bestSellerProduct,
    bestSellerCategory,
    recentOrders,
    CouponsConsumed
  };
};
