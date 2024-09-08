import React, { useEffect, useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import fetchOrders from "../Order/Functions/fetchOrders";
import { calculateStats } from "./Functions/calculateStats";
import { processPurchasesData } from "./Functions/processPurchasesData";
import { processPaymentsData } from "./Functions/processPaymentsData";
import { processStatusData } from "./Functions/processStatusData";
import { processCategorySalesData } from "./Functions/processCategorySalesData";
import Loading from "../../Loader/Loader";
import "./Overview.css";
import SessionExpiryRedirect from "../../Auth&Verify/SessionExpiryRedirect";
import AdminNavbar from "../Components/AdminNavbar";
import { AuthContext } from "../../Auth&Verify/UserAuth";
import fetchProducts from "../Product/Functions/fetchProducts";
import fetchUsers from "../User/Functions/fetchUsers";
import Price from "../../Currency/price";

const Overview = () => {

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [purchasesData, setPurchasesData] = useState(null);
  const [paymentsData, setPaymentsData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [categorySalesData, setCategorySalesData] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    productsInStock: 0,
    bestSellerProduct: "",
    bestSellerCategory: "",
    recentOrders: 0,
    CouponsConsumed: 0,
  });

  const {userInfo} = useContext(AuthContext);
  
  useEffect(() => {
    const fetchAndProcessOrders = async () => {
      try {
        await fetchProducts(setProducts, setLoading, true);
        await fetchOrders(setOrders, setLoading, setSessionExpired);
        await fetchUsers(setUsers, setLoading, setSessionExpired);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchAndProcessOrders();
  }, []);

  useEffect(() => {
    const calculatedStats = calculateStats(orders, products);
    setStats(calculatedStats);
    setPurchasesData(processPurchasesData(orders));
    setPaymentsData(processPaymentsData(orders, userInfo));
    setStatusData(processStatusData(orders));
    setCategorySalesData(processCategorySalesData(orders));
  }, [orders, products, userInfo]);

  return (
    <div>
      <AdminNavbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="overview-container">
          <h1>Dashboard</h1>
          <p>Overview of your store</p>
          <div className="stats-grid-container">
            <div className="stats-grid">
              <div className="stats-card">
                <h3>Total Revenue</h3>
                <p>{<Price valueInShekels={stats.totalRevenue} toFixed={2} withSymbol={true} roundPrice={false}/>}</p>
              </div>
              <div className="stats-card">
                <h3>Total Sales</h3>
                <p>+{stats.totalSales}</p>
              </div>
              <div className="stats-card">
                <h3>Coupons Used</h3>
                <p>{stats.CouponsConsumed}</p>
              </div>
              <div className="stats-card">
                <h3>Products In Stock</h3>
                <p>{stats.productsInStock}</p>
              </div>
              <div className="stats-card">
                <h3>Best Seller Product</h3>
                <p>{stats.bestSellerProduct}</p>
              </div>
              <div className="stats-card">
                <h3>Best Seller Category</h3>
                <p>{stats.bestSellerCategory}</p>
              </div>
              <div className="stats-card">
                <h3>Orders This Month</h3>
                <p>{stats.recentOrders}</p>
                </div>
                <div className="stats-card">
                <h3>Users Registered</h3>
                <p>{users.length}</p>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <h3>Payments Received Per Month</h3>
                {paymentsData ? (
                  <Bar data={paymentsData} />
                ) : (
                  <p>No data available for chart</p>
                )}
              </div>

              <div className="chart-container">
                <h3>Order Statuses</h3>
                {statusData ? (
                  <Bar data={statusData} />
                ) : (
                  <p>No data available for chart</p>
                )}
              </div>

              <div className="chart-container">
                <h3>Orders Per Month</h3>
                {purchasesData ? (
                  <Bar data={purchasesData} />
                ) : (
                  <p>No data available for chart</p>
                )}
              </div>

              <div className="chart-container">
                <h3>Sales by Category</h3>
                {categorySalesData ? (
                  <Bar data={categorySalesData} />
                ) : (
                  <p>No data available for chart</p>
                )}
              </div>
            </div>

            {sessionExpired && (
              <SessionExpiryRedirect trigger={sessionExpired} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
