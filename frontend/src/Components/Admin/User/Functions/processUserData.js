import convertPriceToString from "../../../Currency/priceString";

export const processLoginActivity = (loginActivity) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const loginActivityCounts = Array(12).fill(0);
  if (loginActivity) {
    loginActivity.forEach((activity) => {
      const date = new Date(activity);
      const monthIndex = date.getMonth(); 
      loginActivityCounts[monthIndex]++;
    });
  }

  return {
    labels: months,
    datasets: [
      {
        label: "Number of Logins",
        data: loginActivityCounts,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };
};

export const processPaymentData = (orders, userInfo) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const paymentAmounts = Array(12).fill(0);
  if (orders) {
    orders.forEach(async (order) => {
      const date = new Date(order.date);
        const monthIndex = date.getMonth();
        paymentAmounts[monthIndex] += parseInt(await convertPriceToString(order.totalPrice, userInfo,0,false));
    });
  }
  console.log(paymentAmounts);
  return {
    labels: months,
    datasets: [
      {
        label: `Payments`,
        data: paymentAmounts,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };
};

export const processLogoutActivity = (logoutActivity) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const activityCounts = Array(12).fill(0);
  
    if (logoutActivity) {
      logoutActivity.forEach((activity) => {
        const date = new Date(activity);
        const monthIndex = date.getMonth();
        activityCounts[monthIndex]++;
      });
    }
  
    return {
      labels: months,
      datasets: [
        {
          label: "Number of Logouts",
          data: activityCounts,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
  };
  
  export const processCartActivity = (cartActivity) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const activityCounts = Array(12).fill(0);
  
    if (cartActivity) {
      cartActivity.forEach((activity) => {
        const date = new Date(activity);
        const monthIndex = date.getMonth();
        activityCounts[monthIndex]++;
      });
    }
  
    return {
      labels: months,
      datasets: [
        {
          label: "Number of Add-ons",
          data: activityCounts,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };
