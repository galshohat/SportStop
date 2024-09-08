import React, { useEffect, useContext, useState, useRef } from "react";
import Popup from "../../../Helpers/PopUp/PopUp.js";
import "./UserProfile.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Loading from "../../../Loader/Loader.js";
import fetchUserOrders from "../Functions/fetchUserOrders.js";
import fetchUserData from "../Functions/fetchUserData.js";
import formatDate from "../../../Helpers/FormatDate.js";
import {
  processLoginActivity,
  processLogoutActivity,
  processCartActivity,
  processPaymentData,
} from "../Functions/processUserData";
import { ArrowUpward, ArrowDownward, FilterList } from "@mui/icons-material";
import { useClickOutside } from "../../Functions/orderFiltering";
import Price from "../../../Currency/price.js";
import { AuthContext } from "../../../Auth&Verify/UserAuth.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserProfile = ({ onClose, userId, setSessionExpired }) => {
  const [user, setUser] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  const [loginActivityData, setLoginActivityData] = useState(null);
  const [logoutActivityData, setLogoutActivityData] = useState(null);
  const [cartActivityData, setCartActivityData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("charts");
  const [isDateAscending, setIsDateAscending] = useState(false);
  const [activityFilter, setActivityFilter] = useState({
    Login: true,
    Logout: true,
    "Add-To-Cart": true,
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const filterButtonRef = useRef(null);
  const sortIconRef = useRef(null); 
  const {userInfo} = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {

        let ordersData = await fetchUserOrders(userId, setSessionExpired);
        setOrdersData(ordersData);
    
        const paymentDataProcessed = processPaymentData(
          ordersData.orders,
          userInfo
        );

        setPaymentData(paymentDataProcessed);

        const userData = await fetchUserData(userId, setSessionExpired);
        setUser(userData);

        const loginData = processLoginActivity(userData.LoginActivity);
        setLoginActivityData(loginData);

        const logoutData = processLogoutActivity(userData.LogoutActivity);
        setLogoutActivityData(logoutData);

        const cartData = processCartActivity(userData.CartActivity);
        setCartActivityData(cartData);

        

        

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, setSessionExpired, userInfo]);

  const mixedActivities = [
    ...(user?.LoginActivity.map((date) => ({ type: "Login", date })) || []),
    ...(user?.LogoutActivity.map((date) => ({ type: "Logout", date })) || []),
    ...(user?.CartActivity.map((date) => ({ type: "Add-To-Cart", date })) ||
      []),
  ]
    .filter((activity) => activityFilter[activity.type])
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return isDateAscending ? dateA - dateB : dateB - dateA;
    });

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const toggleDateSorting = (e) => {
    e.stopPropagation(); 
    setIsDateAscending((prev) => !prev);
  };

  const toggleFilterDropdown = (e) => {
    e.stopPropagation(); 
    setShowFilterDropdown((prev) => !prev);
  };

  const handleActivityFilterChange = (type) => {
    setActivityFilter((prevFilter) => ({
      ...prevFilter,
      [type]: !prevFilter[type],
    }));
  };


  useClickOutside(dropdownRef, (event) => {

    if (
      !dropdownRef.current.contains(event.target) &&
      !filterButtonRef.current.contains(event.target) &&
      !sortIconRef.current.contains(event.target)
    ) {
      setShowFilterDropdown(false);
    }
  });

  return (
    <Popup onClose={onClose} title={`User "${user?.name}" Profile`} isX={true}>
      {loading ? (
        <Loading />
      ) : (
        <div className="user-profile-container">

          <div className="profile-section">
            <img
              src={user?.profilePicture}
              alt="Profile"
              className="profile-pic"
            />
            <div className="user-info">
              <p>
                <strong>Username:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone}
              </p>
              <p>
                <strong>Stars:</strong> {<Price valueInShekels={Math.round(user?.stopPoints)} withSymbol={false} />}
              </p>
            </div>
          </div>

          <hr className="divider" />
          <div className="statistics-section">
            <div className="stats-card">
              <h3>Total Payments</h3>
              <p><Price valueInShekels={ordersData?.totalPayments} toFixed={2} withSymbol={true} /></p>
            </div>
            <div className="stats-card">
              <h3>Last Purchase</h3>
              <p>
                {ordersData?.lastPurchase
                  ? formatDate(ordersData.lastPurchase)
                  : "N/A"}
              </p>
            </div>
            <div className="stats-card">
              <h3>Total Orders</h3>
              <p>{ordersData?.totalOrders}</p>
            </div>
          </div>

          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === "charts" ? "active" : ""}`}
              onClick={() => handleTabSwitch("charts")}
            >
              Charts
            </button>
            <button
              className={`tab-button ${activeTab === "data" ? "active" : ""}`}
              onClick={() => handleTabSwitch("data")}
            >
              Data Table
            </button>
          </div>

          <div
            className={`tab-content ${activeTab === "charts" ? "show" : ""}`}
          >
            <div className="chart-section">
              <div className="chart-user-container">
                <h3>Login Activity</h3>
                {loginActivityData && <Bar data={loginActivityData} />}
              </div>
              <div className="chart-user-container">
                <h3>Payments ({userInfo.currency})</h3>
                {paymentData && <Bar data={paymentData} />}
              </div>
              <div className="chart-user-container">
                <h3>Logout Activity</h3>
                {logoutActivityData && <Bar data={logoutActivityData} />}
              </div>
              <div className="chart-user-container">
                <h3>Add-To-Cart Activity</h3>
                {cartActivityData && <Bar data={cartActivityData} />}
              </div>
            </div>
          </div>

          <div className={`tab-content ${activeTab === "data" ? "show" : ""}`}>
            <table className="activity-table">
              <thead>
                <tr>
                  <th>
                    Type of Activity
                    <FilterList
                      ref={filterButtonRef}
                      className="filter-icon"
                      onClick={toggleFilterDropdown}
                      style={{ cursor: "pointer", marginLeft: "0.5vw" }}
                    />
                    {showFilterDropdown && (
                      <div
                        className="activity-filter-dropdown"
                        ref={dropdownRef}
                      >
                        <label>
                          <input
                            type="checkbox"
                            checked={activityFilter.Login}
                            onChange={() => handleActivityFilterChange("Login")}
                          />
                          Login
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={activityFilter.Logout}
                            onChange={() =>
                              handleActivityFilterChange("Logout")
                            }
                          />
                          Logout
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={activityFilter["Add-To-Cart"]}
                            onChange={() =>
                              handleActivityFilterChange("Add-To-Cart")
                            }
                          />
                          Add-To-Cart
                        </label>
                      </div>
                    )}
                  </th>
                  <th>
                    When
                    {isDateAscending ? (
                      <ArrowUpward
                        ref={sortIconRef} 
                        className="sort-icon"
                        onClick={toggleDateSorting}
                        style={{ cursor: "pointer", marginLeft: "0.5vw" }}
                      />
                    ) : (
                      <ArrowDownward
                        ref={sortIconRef} 
                        className="sort-icon"
                        onClick={toggleDateSorting}
                        style={{ cursor: "pointer", marginLeft: "0.5vw" }}
                      />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {mixedActivities.map((activity, index) => (
                  <tr key={`${activity.type}-${index}`}>
                    <td>{activity.type}</td>
                    <td>{formatDate(activity.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default UserProfile;
