export const processPurchasesData = (orders) => {

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  

    const purchaseCounts = Array(12).fill(0);
  

    orders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const monthIndex = orderDate.getMonth(); 
      purchaseCounts[monthIndex] += 1;
    });
  

    return {
      labels: months,
      datasets: [
        {
          label: "Orders Per Month", 
          data: purchaseCounts, 
          backgroundColor: "rgba(54, 162, 235, 0.2)", 
          borderColor: "rgba(54, 162, 235, 1)", 
          borderWidth: 1, 
        },
      ],
    };
  };