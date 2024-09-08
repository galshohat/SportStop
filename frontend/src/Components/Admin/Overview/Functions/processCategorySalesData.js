export const processCategorySalesData = (orders) => {
    const categoryCounts = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        item.product.categories.forEach((category) => {
          if (!categoryCounts[category]) {
            categoryCounts[category] = 0;
          }
          categoryCounts[category] += item.quantity;
        });
      });
    });
  
    return {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: "Items Sold",
          data: Object.values(categoryCounts),
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
  };