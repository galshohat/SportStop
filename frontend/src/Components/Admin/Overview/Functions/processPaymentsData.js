import convertPriceToString from "../../../Currency/priceString";

export const processPaymentsData = (orders, userInfo) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const payments = Array(12).fill(0);
    orders.forEach(async (order) => {

      const orderDate = new Date(order.orderDate);
      const monthIndex = orderDate.getMonth();
      payments[monthIndex] += parseInt(await convertPriceToString(order.orderPrice, userInfo,0,false));
    });
  
    return {
      labels: months,
      datasets: [
        {
          label: "Payments Received",
          data: payments,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };