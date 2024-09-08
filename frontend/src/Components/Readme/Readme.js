import React, { useState } from "react";
import "./Readme.css";
import Navbar from "../Navbar/Navbar";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import logo from "../../navbar-logo.png";

const ReadmePage = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const markers = [
    {
      id: 1,
      position: { lat: 32.0753, lng: 34.7748 },
      label: "King George St",
    },
    {
      id: 2,
      position: { lat: 32.0655, lng: 34.7764 },
      label: "Rothschild Blvd",
    },
  ];

  return (
    <div className="readme-container">
      <Navbar />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <img
          src={logo}
          alt="SportStop Logo"
          style={{ width: "20vw", height: "auto" }}
        />
        <h1 style={{ margin: 0 }}>README</h1>
      </div>

      <div className="section" onClick={() => toggleSection("about")}>
        <h2>About the Store</h2>
        {expandedSections["about"] && (
          <div>
            <p>
              SportStop is a rapidly growing digital store specializing in
              high-quality sports clothing and equipment for popular sports such
              as football, basketball, tennis, and swimming. As a trusted name
              among athletes and sports enthusiasts, we continue to expand our
              collection, bringing on board more renowned sporting brands and
              exclusive collaborations.
            </p>
            <p>
              Our commitment to excellence and customer satisfaction has
              attracted a loyal customer base. SportStop is becoming a hub for
              sports enthusiasts looking for the latest gear and apparel. We are
              constantly evolving, adding new product lines, and partnering with
              top brands in the industry.
            </p>
            <p>
              Visit our main store locations in Tel Aviv, where you can explore
              our top collections, try on products, and get personalized advice
              from our expert team.
            </p>
            <ul>
              <li>
                <strong>Location 1:</strong> Near King George Street, Tel Aviv
              </li>
              <li>
                <strong>Location 2:</strong> Near Rothschild Boulevard, Tel Aviv
              </li>
            </ul>
            <p>
              Press Command / Ctrl (Mac / Windows) and use your mouse to move
              inside the map.
            </p>
            <div className="map-container">
              <LoadScript googleMapsApiKey="AIzaSyBr3hPmf7suzWAUDO7lDJEnjdKT2da7crc">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "400px" }}
                  center={{ lat: 32.0753, lng: 34.7748 }}
                  zoom={14}
                >
                  {markers.map((marker) => (
                    <Marker
                      key={marker.id}
                      position={marker.position}
                      label={marker.label}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        )}
      </div>

      <div className="section" onClick={() => toggleSection("additionalPages")}>
        <h2>Additional Pages</h2>
        {expandedSections["additionalPages"] && (
          <ul>
            <li>
              <strong>Overview (Admin):</strong> A comprehensive dashboard for
              administrators, offering key insights into the store's
              performance. This page displays critical data such as total
              revenue, total sales, products in stock, best sellers, and recent
              order statistics. The admin can quickly grasp the overall health
              of the store and make informed decisions based on real-time data.
            </li>
            <li>
              <strong>Stars:</strong> A loyalty program where customers earn
              points (referred to as "stars") for each purchase. These stars can
              be redeemed for discount coupons on future purchases, encouraging
              customer retention and repeat business. The program is integrated
              seamlessly within the store, allowing users to track their earned
              stars and view available discounts. Each transaction comes with
              10% in stars.
            </li>
            <li>
              <strong>Currency:</strong> Using real-time API to get the
              conversion rate (you might see price changes while browsing).
              Allows users to set and update the currency used throughout the
              store, including interactions involving prices and stars. This
              page ensures that all financial transactions are displayed in the
              correct currency, making the shopping experience consistent and
              transparent for users worldwide.
            </li>
            <li>
              <strong>Orders:</strong> A detailed page displaying both current
              and historical orders. It includes a messaging system with
              real-time chat between users and the admin (press the messenger
              icon), powered by WebSockets. This page provides designed order tracking (try and play with it),
              status updates, and a complete history of completed orders,
              enhancing the customer service experience.
            </li>
          </ul>
        )}
      </div>

      <div className="section" onClick={() => toggleSection("navigation")}>
        <h2>Important Notes</h2>
        {expandedSections["navigation"] && (
          <ul>
            <li>Admin email: admin@gmail.com, Password: AAAAAAA1</li>
            <li>Didn't work with a partner.</li>
            <li>
              <strong>
                To run the test.js file run "DISABLE_AUTH=true node app.js" and
                then "node test.js" inside the backend folder. I didn't find
                away to succesfully work with the cookies there so i disabled
                cookies auth for this part (Atleast it implies that the cookies
                works well). To run the program normally you can run "npm start
                app.js".
              </strong>
            </li>
            <li>
              User activity can be found in the user profile. Click the account
              profile icon in the row of a user, then navigate to the "Data
              Table" tab to view detailed activity logs.
            </li>
            <li>
              The app works with MongoDB for database management. The
              `persist.js` file loads data from the database and saves it into a
              `dataPersistence.js` file for efficient access.
            </li>
            <li>
              To access the home page, click on the logo of the store located in
              the top left corner of the navbar. This will redirect you to the
              main page featuring highlighted products.
            </li>
            <li>
              Image uploads for products must be in JPEG, JPG, or PNG format to
              ensure compatibility and maintain image quality standards.
            </li>
            <li>
              Admins have full access to both the store interface and the admin
              dashboard, with a dedicated button on the navbar for quick access
              to admin functions. This dual access improves workflow and allows
              admins to experience the store from a customer perspective.
            </li>
            <li>
              The checkout page is designed with guided inputs. In the expiry
              date fields, the format adjusts automatically with slashes (/) and
              spaces, ensuring month inputs are between 01-12, and CCV is
              exactly 3 digits.
            </li>
          </ul>
        )}
      </div>

      <div className="section" onClick={() => toggleSection("security")}>
        <h2>Security and Project Structure</h2>
        {expandedSections["security"] && (
          <ul>
            <li>
              The backend is built using Express with Node.js, and MongoDB is
              used for database management. The frontend is developed with
              React, ensuring a responsive and dynamic user experience. The
              server runs on port 8000, while the client runs on port 3000,
              facilitating smooth development and testing processes.
            </li>
            <li>
              The app is fortified against DoS attacks using Helmet, which helps
              secure Express apps by setting various HTTP headers. XSS is
              cleaned using middleware, and a rate limiter is implemented to
              limit the number of requests a user can make in a specific
              timeframe, providing additional layers of security.
            </li>
            <li>
              Authentication is managed using JWT cookies.{" "}
              <strong>
                While GET requests are permitted without login for a smoother
                user experience, all POST, PUT, and DELETE requests are
                protected by cookie expiration checks to safeguard sensitive
                operations.
              </strong>{" "}
              For admin routes, additional safety measures are handled by the
              `auth.js` file, ensuring only authorized personnel have access.
            </li>
          </ul>
        )}
      </div>

      <div className="section" onClick={() => toggleSection("hardToDo")}>
        <h2>What Was Hard to Do?</h2>
        {expandedSections["hardToDo"] && (
          <ul>
            <li>
              <strong>WebSocket Implementation:</strong> Integrating real-time
              communication was one of the most complex tasks, requiring precise
              handling of WebSocket connections, message delivery, and updates.
              It was crucial to ensure stability, especially for the live chat
              feature on the order page.
            </li>
            <li>
              <strong>Efficiency of Functions:</strong> Optimizing functions to
              handle large data sets efficiently without compromising
              performance was a constant challenge. This involved refining
              algorithms and making strategic choices about data handling and
              state management.
            </li>
            <li>
              <strong>Time Management:</strong> The project was time-consuming,
              primarily due to the need to learn and implement new technologies.
              Balancing learning with development, testing, and optimization
              took a lot of effort.
            </li>
            <li>
              <strong>CSS and Design:</strong> Achieving a polished look and
              feel required careful attention to CSS, including responsive
              design, animations, and overall aesthetics. Numerous adjustments
              and design iterations were necessary to meet a professional
              standard. Here I needed much help from llm when I encountered
              design issues.
            </li>
            <li>
              <strong>Organization:</strong> Structuring the project to keep
              code clean, maintainable, and scalable was a major focus. This
              involved organizing components, separating concerns, and ensuring
              that the backend and frontend communicated effectively.
            </li>
          </ul>
        )}
      </div>

      <div className="section" onClick={() => toggleSection("routes")}>
        <h2>Supported Routes</h2>
        {expandedSections["routes"] && (
          <ul>
            <li>
              <strong>/</strong> - Home Page: Displays featured products chosen
              by the admin, showcasing the latest and most popular items. It’s
              designed to attract customers with highlighted promotions and
              bestsellers. Users can browse categories, search for products, and
              add items to their cart directly from this page.
            </li>
            <li>
              <strong>/auth</strong> - Authentication Page: Handles user login
              and registration. If a user is already logged in, they are
              redirected away from this page. It includes validation, error
              handling, and a user-friendly form interface.
            </li>
            <li>
              <strong>/currency</strong> Using real-time API to get the
              conversion rate (you might see price changes while browsing).
              Allows users to set and update the currency used throughout the
              store, including interactions involving prices and stars. This
              page ensures that all financial transactions are displayed in the
              correct currency, making the shopping experience consistent and
              transparent for users worldwide.
            </li>
            <li>
              <strong>/llm</strong> - Questions Page: Displays a page where
              users can view questions and answers that have been previously
              asked, providing useful information and guidance.{" "}
              <strong>
                You need to write /llm in the search bar to reach it.
              </strong>
            </li>
            <li>
              <strong>/search-results</strong> - Search Results Page: Shows the
              results of a search query, displaying matching products (by
              description / name / category). It provides filters for colors,
              sizes, categories, and gender to refine the search further.
            </li>
            <li>
              <strong>/cart</strong> - Shopping Cart: Displays items the user
              has added to their cart. Users can adjust quantities, remove
              items, and proceed to checkout, making it easy to manage their
              purchases.
            </li>
            <li>
              <strong>/order</strong> - Order Management: Displays current and
              historical order data for the user, including order status and
              tracking, with real-time messaging with the admin for inquiries.
            </li>
            <li>
              <strong>/edit-account</strong> - Edit Account: Allows users to
              update their account information, including personal details,
              password changes, and profile picture uploads, enhancing user
              control over their data.
            </li>
            <li>
              <strong>/admin</strong> - Admin Dashboard: Provides an overview
              for administrators, displaying key analytics about the store.
              Admins can manage products, orders, users, and review sales data.
            </li>
            <li>
              <strong>/admin/categories</strong> - Category Management: A page
              for managing product categories. Admins can add, update, or delete
              categories, impacting product organization.
            </li>
            <li>
              <strong>/admin/products</strong> - Product Management: Allows
              admins to manage products, including adding new items, updating
              existing ones, and ensuring accurate product details.
            </li>
            <li>
              <strong>/admin/sizes</strong> - Size Management: Enables admins to
              manage product sizes, ensuring accurate options for customers.
            </li>
            <li>
              <strong>/admin/colors</strong> - Color Management: Allows
              management of product colors, maintaining consistent and appealing
              options across the store.
            </li>
            <li>
              <strong>/admin/users</strong> - User Management: Provides control
              over user accounts, including viewing details, managing roles, and
              maintaining a secure user base.
            </li>
            <li>
              <strong>/admin/orders</strong> - Order Management (Admin): Admins
              can view and manage all orders, update statuses, and communicate
              with customers with the messenger chat (press the messenger icon
              in the row of the order).
            </li>
            <li>
              <strong>/stars</strong> - Loyalty Page: Displays the stars earned
              by users, showing available discounts and redemption options to
              encourage repeat purchases.
            </li>
            <li>
              <strong>/checkout</strong> - Checkout Process and thank you
              screen: Handling the checkout process, guiding users through
              payments with automated input formatting for dates, credit card
              details, and more. Thank you screen gives the user the token of
              the order that can be used for tracking and communicating with the
              admin in the 'My Orders' screen. They haven't got a specific
              route, implemented using Popup.js.
            </li>
            <li>
              <strong>/*</strong> - Not Found: A fallback route that handles
              unmatched URLs, displaying a "Not Found" message to gracefully
              manage navigation errors.
            </li>
          </ul>
        )}
      </div>

      <div className="section" onClick={() => toggleSection("uploadImages")}>
        <h2>Uploading Images</h2>
        {expandedSections["uploadImages"] && (
          <p>
            The <strong>uploads</strong> directory handles all image uploads,
            using the <strong>multer</strong> npm package. This package
            simplifies the file upload process, ensuring images are stored
            correctly and securely. Admins can easily upload product images in
            supported formats (JPEG, JPG, PNG), making it straightforward to
            update product visuals without technical complications. The
            `uploads` directory is utilized for storing product images using the
            multer npm package, making it easy to manage file uploads.
          </p>
        )}
      </div>
    </div>
  );
};

export default ReadmePage;
