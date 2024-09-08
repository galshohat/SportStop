export const processStatusData = (orders) => {
    const statuses = ["Pending", "Completed", "Shipped"];
    const statusCounts = { Pending: 0, Completed: 0, Shipped: 0 };
  
    orders.forEach((order) => {
      if (statusCounts[order.status] !== undefined) {
        statusCounts[order.status] += 1;
      }
    });
  
    return {
      labels: statuses,
      datasets: [
        {
          label: "Order Statuses",
          data: Object.values(statusCounts),
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    };
  };