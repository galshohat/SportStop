import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Collapse,
  ListItemText,
} from "@mui/material";
import "./QuestionsPage.css";
import Navbar from "../Navbar/Navbar.js";

const questionsWithAnswers = [
  {
    question:
      "I get 'Cannot access 'convertCurrency' before initialization'. Fix it.",
    answer: (
      <div>
        This error occurs because `convertCurrency` is being used before it is
        defined in your code. This is a common issue when dealing with
        JavaScript functions, especially if you're using function expressions or
        arrow functions. JavaScript hoists function declarations but not
        function expressions or arrow functions, which means you need to define
        them before they are called. Here’s how you can fix this error by
        restructuring your code so that the function is defined before it’s
        used:
        <pre>
          <code>
            {`// Define the function before using it
      // Incorrect Order - This will cause an error
      console.log(convertCurrency(100)); // Error: Cannot access 'convertCurrency' before initialization
      const convertCurrency = async (total) => {
        // Your conversion logic
      };
      
      // Correct Order - Function defined before usage
      const convertCurrency = async (total) => {
        // Conversion logic, for example:
        console.log('Converting currency:', total);
        return total * 1.1; // Assume some conversion rate
      };
      
      // Now call the function after it's defined
      convertCurrency(100).then(result => {
        console.log('Converted:', result); // This will work correctly
      });`}
          </code>
        </pre>
        <p>
          By moving the function definition above its first usage, you ensure
          that the JavaScript interpreter knows about the function before it’s
          called, preventing any initialization errors.
        </p>
      </div>
    ),
  },
  {
    question: "Fix the CSS layout; the grid items are not aligning properly.",
    answer: (
      <div>
        Grid items not aligning properly is often caused by misconfigured grid
        properties or missing alignment settings on the grid container or items.
        To align grid items correctly, ensure that you are using
        `grid-template-columns` and `grid-template-rows` to define the grid
        layout, and adjust alignment using properties like `align-items`,
        `justify-items`, and `gap`. Here's an example demonstrating how to set
        up a grid container and align its items properly:
        <pre>
          <code>
            {`/* Correct CSS Grid Setup */
      .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* Three columns, each taking equal space */
        grid-template-rows: auto; /* Rows will adjust based on content */
        gap: 20px; /* Space between grid items */
        align-items: center; /* Vertically center items */
        justify-items: center; /* Horizontally center items */
      }
      
      .item {
        padding: 20px;
        background-color: #f1f1f1;
        border: 1px solid #ccc;
      }
      
      /* Responsive Adjustments */
      @media (max-width: 768px) {
        .container {
          grid-template-columns: repeat(2, 1fr); /* Adjust to two columns on smaller screens */
        }
      }
      
      @media (max-width: 480px) {
        .container {
          grid-template-columns: 1fr; /* Stack items in one column on very small screens */
        }
      }`}
          </code>
        </pre>
        <p>
          Make sure to test the layout across different screen sizes and adjust
          the grid properties accordingly. Use media queries to handle
          responsive layouts, ensuring your grid remains well-aligned and
          visually appealing on all devices.
        </p>
      </div>
    ),
  },
  {
    question:
      "Position this element in the center of the page, it doesn't work.",
    answer: (
      <div>
        Centering elements on the page is a common CSS task, and there are
        multiple ways to achieve this depending on the layout context. Using
        Flexbox and Grid are two powerful methods that provide easy and reliable
        solutions. Below are two approaches: one using Flexbox and another using
        CSS Grid. Flexbox is great for centering content when you have a single
        axis (either vertical or horizontal), while Grid can easily center
        content in both dimensions:
        <pre>
          <code>
            {`/* Centering with Flexbox */
      .center {
        display: flex;
        justify-content: center; /* Centers horizontally */
        align-items: center; /* Centers vertically */
        height: 100vh; /* Full viewport height to ensure it's centered */
        background-color: #e0e0e0; /* Optional background to visualize the area */
      }
      
      /* Centering with CSS Grid */
      .center-grid {
        display: grid;
        place-items: center; /* Centers both vertically and horizontally */
        height: 100vh; /* Full viewport height */
        background-color: #d0d0d0; /* Optional background to differentiate from flexbox */
      }
      
      /* HTML Structure */
      <div class="center">
        <p>Centered with Flexbox</p>
      </div>
      
      <div class="center-grid">
        <p>Centered with Grid</p>
      </div>`}
          </code>
        </pre>
        <p>
          Both methods are responsive and adaptable to different content sizes.
          Use `place-items: center` for Grid and `justify-content`/`align-items`
          for Flexbox to achieve perfect centering in a few lines of code.
        </p>
      </div>
    ),
  },
  {
    question: "Make the rain effect smoother, it's lagging.",
    answer: (
      <div>
        To make the rain effect smoother, you need to optimize both your CSS
        animations and the way you manage DOM elements if you’re dynamically
        generating raindrops. Use CSS keyframes for smooth transitions and
        minimize JavaScript manipulations, as too many DOM changes can cause
        performance issues. Below is an optimized CSS setup for a rain effect,
        using keyframes and a few performance tweaks:
        <pre>
          <code>
            {`/* CSS for Smooth Rain Effect */
      .rain-container {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100vh;
        background: linear-gradient(to bottom, #a1c4fd, #c2e9fb); /* Sky background */
      }
      
      .rain-drop {
        position: absolute;
        top: -10%;
        width: 2px;
        height: 20px;
        background: rgba(255, 255, 255, 0.7); /* Light transparent white for raindrop */
        animation: fall linear infinite; /* Smooth linear animation */
        animation-duration: calc(1s + 2s * var(--i)); /* Randomized duration */
      }
      
      /* Keyframes for the falling effect */
      @keyframes fall {
        to {
          transform: translateY(110vh); /* Ensure it falls off the screen */
        }
      }
      
      /* HTML Structure */
      <div class="rain-container">
        <div class="rain-drop" style="--i: 1;"></div>
        <div class="rain-drop" style="--i: 2;"></div>
        <div class="rain-drop" style="--i: 3;"></div>
      </div>`}
          </code>
        </pre>
        <p>
          Use CSS variables (`--i`) to create variations in the animation speed,
          making the rain effect look more natural. Keep the number of raindrops
          reasonable to avoid performance drops, especially on lower-end
          devices.
        </p>
      </div>
    ),
  },
  {
    question: "Fix the button animation; it's choppy.",
    answer: (
      <div>
        Button animations can appear choppy if the transitions are not smooth or
        if there are performance issues caused by frequent reflows or repaints.
        To smooth out button animations, use `transition` properties with easing
        functions and avoid abrupt changes that may cause the animation to look
        jerky. Here’s a more refined approach to enhancing button animations:
        <pre>
          <code>
            {`/* Smooth button animation with easing */
      button {
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        cursor: pointer;
        background-color: #007bff;
        color: #fff;
        border-radius: 5px;
        transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      button:hover {
        background-color: #0056b3; /* Change to a darker shade */
        transform: scale(1.05); /* Slightly enlarge the button */
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Add a subtle shadow effect */
      }
      
      /* Ensure the animation is hardware accelerated */
      button:active {
        transform: scale(0.95); /* Give a pressed effect */
      }`}
          </code>
        </pre>
        <p>
          Use CSS properties like `transform` for smooth scaling and
          `box-shadow` for depth effects, which are optimized for animations.
          Avoid animating properties like `width` or `height`, as they can cause
          layout shifts and performance issues.
        </p>
      </div>
    ),
  },
  {
    question:
      "Align text vertically and horizontally in a div, it's not working.",
    answer: (
      <div>
        Aligning text both vertically and horizontally can be easily achieved
        with Flexbox. Flexbox simplifies the process of centering elements
        inside a container, making it particularly useful for text alignment.
        Below are examples using Flexbox to center content in any container:
        <pre>
          <code>
            {`/* Flexbox alignment for text */
      .center-text {
        display: flex;
        justify-content: center; /* Centers content horizontally */
        align-items: center; /* Centers content vertically */
        height: 100px; /* Ensure height is set for vertical centering */
        background-color: #f4f4f4; /* Optional: to visualize the container */
        border: 1px solid #ccc;
        font-size: 18px;
      }
      
      /* Centering large blocks of text */
      .center-block {
        display: flex;
        flex-direction: column; /* Stack items if needed */
        justify-content: center;
        align-items: center;
        text-align: center; /* For centering text inside */
        padding: 20px;
      }`}
          </code>
        </pre>
        <p>
          Use `align-items` for vertical alignment and `justify-content` for
          horizontal alignment. You can also adjust `text-align` within the
          container to ensure text flows nicely when wrapping inside smaller
          containers.
        </p>
      </div>
    ),
  },
  {
    question:
      "My CSS animations are not starting; they just jump to the end state.",
    answer: (
      <div>
        CSS animations may not start or appear to skip to the end state due to
        missing keyframe definitions, incorrect animation durations, or the lack
        of `animation-fill-mode` properties. Here's how to set up animations
        correctly to ensure they run smoothly:
        <pre>
          <code>
            {`/* Correctly set up CSS animations */
      .animated-element {
        opacity: 0; /* Start hidden */
        animation: fadeIn 1s ease-in-out forwards; /* Smooth transition */
        transition: all 0.5s ease; /* Additional smooth transition */
      }
      
      /* Define the keyframes for the animation */
      @keyframes fadeIn {
        0% {
          opacity: 0; /* Start invisible */
          transform: translateY(-10px); /* Start slightly above */
        }
        50% {
          opacity: 0.5; /* Midway point */
          transform: translateY(-5px); /* Adjust for smoother transition */
        }
        100% {
          opacity: 1; /* End fully visible */
          transform: translateY(0); /* End at final position */
        }
      }`}
          </code>
        </pre>
        <p>
          Use `animation-fill-mode: forwards;` to maintain the animation's final
          state, and ensure that `animation` properties such as duration, timing
          function, and keyframes are properly set. Adjust `transform`
          properties within keyframes for added smoothness.
        </p>
      </div>
    ),
  },
  {
    question:
      "Help me create test.js with node-fetch, how should i do it with nice stryling?",
    answer: (
      <div>
        Chalk is a popular Node.js library used to style and colorize text in
        the terminal. It makes it easier to format output, which can be
        particularly useful for creating visually distinct logs or messages.
        Here’s a brief overview:
        <pre>
          <code>
            {`import fetch from 'node-fetch';
import chalk from 'chalk';

const baseUrl = 'http://localhost:3000/api'; // Replace with your base URL

const logResult = (testNumber, testName, passed, error = null) => {
  const status = passed ? chalk.green("Completed") : chalk.red("Failed");
  if (error) console.log(chalk.red("Error:"), error);
};`}
          </code>
        </pre>
        <p>
          Logging Results: The logResult function handles the result display
          with colors. Chalk helps in making logs and messages more readable and
          can highlight important information or errors effectively, especially
          when dealing with large amounts of output in the terminal.
        </p>
      </div>
    ),
  },
  {
    question: "Fix the grid layout; items overlap on smaller screens.",
    answer: (
      <div>
        Overlapping items in a grid layout typically occur when the grid setup
        isn't responsive or doesn't adjust column sizes for smaller screens. Use
        media queries and `grid-template-columns` to dynamically adapt the grid
        layout based on the screen width. Below is an example of making a grid
        responsive:
        <pre>
          <code>
            {`/* Base grid setup for larger screens */
      .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr); /* Four equal columns */
        gap: 10px; /* Space between grid items */
        margin: 20px;
        padding: 10px;
      }
      
      /* Responsive adjustments for tablets */
      @media (max-width: 768px) {
        .grid {
          grid-template-columns: repeat(2, 1fr); /* Two columns on smaller screens */
          gap: 8px;
        }
      }
      
      /* Stacks items in one column on mobile */
      @media (max-width: 480px) {
        .grid {
          grid-template-columns: 1fr; /* Single column layout */
          gap: 5px;
        }
      }
      
      /* Ensuring items adjust to prevent overlap */
      .grid-item {
        background-color: #fff;
        padding: 15px;
        border: 1px solid #ddd;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }`}
          </code>
        </pre>
        <p>
          Use media queries to adjust the number of columns dynamically,
          ensuring items don't overlap. Adjust `gap` sizes for consistent
          spacing, and make sure grid items have flexible sizing to handle
          different screen widths gracefully.
        </p>
      </div>
    ),
  },
  {
    question: "How do I make the raindrops fade out smoothly at the end?",
    answer: (
      <div>
        Use keyframes with opacity transitions to make raindrops fade out
        smoothly:
        <pre>
          <code>
            {`// Raindrop fade-out effect
    .rain-drop {
      position: absolute;
      top: 0;
      animation: fall 2s linear infinite, fadeOut 2s linear forwards;
    }
    
    @keyframes fadeOut {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "The sticky header doesn't stick when scrolling.",
    answer: (
      <div>
        Ensure that the `position: sticky` is correctly set on the element and
        that its parent container has appropriate overflow settings:
        <pre>
          <code>
            {`// Sticky header example
    .header {
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 100;
    }`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "The hover effect is not applying correctly. Fix it.",
    answer: (
      <div>
        Check that the CSS hover effect is targeting the correct element and
        ensure it’s not being overridden by other styles:
        <pre>
          <code>
            {`// CSS hover effect
    .button:hover {
      background-color: #555;
      color: #fff;
    }`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question:
      "Fix the WebSocket error logging; it's not showing the actual error details.",
    answer: (
      <div>
        To properly log WebSocket errors with detailed information, adjust the
        `ws.on('error')` event to display the full error stack:
        <pre>
          <code>
            {`// Improved WebSocket error logging
      ws.on("error", (error) => {
        console.error("WebSocket error occurred:", error.message);
        console.error(error.stack);
      });`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question:
      "The WebSocket connection is being closed unexpectedly. Handle it.",
    answer: (
      <div>
        To handle unexpected WebSocket closures, ensure you add appropriate
        reconnect logic or handle specific close codes:
        <pre>
          <code>
            {`// Handle WebSocket close events
      ws.on("close", (code, reason) => {
        console.log(\`WebSocket closed with code: \${code}, reason: \${reason}\`);
        // Implement reconnection logic here if needed
      });`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "Messages are not being broadcasted properly. Debug this.",
    answer: (
      <div>
        Ensure that `wss.clients` is iterating over the correct set of connected
        clients, and the message is being sent correctly:
        <pre>
          <code>
            {`// Debugging message broadcast
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
          console.log("Message sent to client:", message);
        }
      });`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question:
      "The server isn't handling JSON data correctly. Fix the middleware.",
    answer: (
      <div>
        Ensure the correct body parser middleware is being used to handle JSON
        data correctly in requests:
        <pre>
          <code>
            {`// Correct middleware setup
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "Fix the CORS settings; frontend requests are being blocked.",
    answer: (
      <div>
        Update the CORS configuration to ensure requests from your frontend are
        allowed:
        <pre>
          <code>
            {`// Updated CORS configuration
      const corsOptions = {
        origin: "http://localhost:3000", // Allow your frontend origin
        credentials: true,
      };
      
      app.use(cors(corsOptions));`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "Rate limiting isn't working as expected. Adjust it.",
    answer: (
      <div>
        Ensure the rate limiter is configured correctly and applied to the right
        routes:
        <pre>
          <code>
            {`// Adjusted rate limiter settings
      const rateLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: "Too many requests, please try again later.",
      });
      
      app.use(rateLimiter);`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "Fix the error handler; it's not catching all errors.",
    answer: (
      <div>
        Update the error handler to catch and log all errors including async
        errors:
        <pre>
          <code>
            {`// Improved error handler
      app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: "An internal error occurred" });
      });
      
      // To catch async errors, wrap routes with a try-catch or use async error handler middleware`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "WebSocket keeps disconnecting when idle; keep it alive.",
    answer: (
      <div>
        To prevent WebSocket connections from closing when idle, send periodic
        keep-alive messages:
        <pre>
          <code>
            {`// WebSocket keep-alive implementation
      setInterval(() => {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: "ping" }));
          }
        });
      }, 30000); // Send a ping every 30 seconds`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "Fix the database connection, it keeps timing out.",
    answer: (
      <div>
        Adjust the database connection settings to improve stability and prevent
        timeouts:
        <pre>
          <code>
            {`// Enhanced MongoDB connection with retry logic
      mongoose.connect(process.env.DBConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of the default 30 seconds
      })
      .then(() => console.log("DB connection is ready..."))
      .catch((err) => {
        console.error("Failed to connect to DB:", err);
      });`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "The WebSocket server is not responding on connection. Check it.",
    answer: (
      <div>
        Ensure the WebSocket server is correctly set up and responding to
        connection events:
        <pre>
          <code>
            {`// WebSocket connection handler
      wss.on("connection", (ws) => {
        console.log("Client connected");
      
        ws.send(JSON.stringify({ message: "Welcome to the WebSocket server" }));
      
        ws.on("message", (data) => {
          console.log("Received:", data);
        });
      
        ws.on("close", () => {
          console.log("Client disconnected");
        });
      });`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I create a socket.io server with Express?",
    answer: (
      <div>
        To set up a socket.io server with Express, first install socket.io and
        express. Then, initialize the server:
        <pre>
          <code>
            {`const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I set up CORS with Express and React?",
    answer: (
      <div>
        Install the CORS package with <code>npm install cors</code>. Then, add
        CORS to your Express app:
        <pre>
          <code>
            {`const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
}));

app.listen(3000, () => console.log('Server running'));`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I navigate between pages in React using React Router?",
    answer: (
      <div>
        Install React Router with <code>npm install react-router-dom</code> and
        set up routes using <code>Routes</code> and <code>Route</code>.
        <pre>
          <code>
            {`// Setting up routes
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I validate input fields in a React form?",
    answer: (
      <div>
        Use state to track input values and add validation checks. Libraries
        like Yup simplify validation.
        <pre>
          <code>
            {`// Basic validation using React state
const [value, setValue] = useState('');
const isValid = value.trim() !== '';

<input value={value} onChange={(e) => setValue(e.target.value)} />`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How can I update a user's currency preference in the database?",
    answer: (
      <div>
        Send a PUT or POST request with the updated currency value to your
        backend endpoint.
        <pre>
          <code>
            {`// Express route to update user currency
router.post('/change-currency/:id', async (req, res) => {
  const { currency } = req.body;

  if (!currency) {
    return res.status(400).send('Currency is required');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send('User not found');
  }

  user.currency = currency;
  await user.save();
  res.status(200).json({ success: true, message: 'Currency updated successfully', user });
});`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question:
      "How do I check if an email already exists before signing up a new user?",
    answer: (
      <div>
        Create an endpoint that checks if the email exists in the database
        before proceeding with the signup.
        <pre>
          <code>
            {`// Endpoint to check if email exists
router.post('/existing-email', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(200).json({ exists: true });
  }
  return res.status(200).json({ exists: false });
});`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "Why is my fetch request being blocked by CORS policy?",
    answer: (
      <div>
        CORS errors occur when the backend does not allow requests from the
        client origin. Configure your backend to allow CORS by using the{" "}
        <code>cors</code> middleware.
        <pre>
          <code>
            {`// Allowing CORS in Express
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
}));`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I implement pagination for my product listings?",
    answer: (
      <div>
        Use query parameters to manage page numbers and limits, then adjust your
        database queries accordingly.
        <pre>
          <code>
            {`// Express route for paginated products
router.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const products = await Product.find().skip((page - 1) * limit).limit(limit);
  res.json(products);
});`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I use the useNavigate hook in React Router?",
    answer: (
      <div>
        Use the <code>useNavigate</code> hook to programmatically navigate
        between pages.
        <pre>
          <code>
            {`// Using useNavigate
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return <button onClick={goToHome}>Go Home</button>;
};`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question:
      "How do I decode a JWT token on the client-side using JavaScript?",
    answer: (
      <div>
        To decode a JWT token on the client-side, you can use the `jwt-decode`
        package or parse the token manually. Here's how to do it using
        `jwt-decode`:
        <pre>
          <code>
            {`// Install jwt-decode with npm
npm install jwt-decode

// Decoding a JWT token
import jwtDecode from 'jwt-decode';

const token = 'your.jwt.token';
const decodedToken = jwtDecode(token);

console.log(decodedToken); // Outputs the decoded payload`}
          </code>
        </pre>
      </div>
    ),
  },

  {
    question: "How do I handle JWT token expiration on the client-side?",
    answer: (
      <div>
        You can check if a JWT token has expired by comparing the current time
        with the token's expiration time (`exp` claim).
        <pre>
          <code>
            {`import jwtDecode from 'jwt-decode';

const isTokenExpired = (token) => {
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

const token = 'your.jwt.token';
if (isTokenExpired(token)) {
  console.log('Token has expired');
} else {
  console.log('Token is valid');
}`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How can I customize tooltips in react-chartjs-2?",
    answer: (
      <div>
        Customize tooltips in `react-chartjs-2` by modifying the `options`
        object, specifically the `plugins.tooltip` property.
        <pre>
          <code>
            {`import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March', 'April'],
  datasets: [
    {
      label: 'Sales',
      data: [65, 59, 80, 81],
      borderColor: 'rgba(75,192,192,1)',
    },
  ],
};

const options = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          label += ': $' + context.raw.toFixed(2);
          return label;
        },
      },
    },
  },
};

const CustomTooltipChart = () => <Line data={data} options={options} />;

export default CustomTooltipChart;`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I refresh an expired JWT token using a refresh token?",
    answer: (
      <div>
        To refresh an expired JWT, use a refresh token endpoint on your server
        that verifies the refresh token and issues a new access token.
        <pre>
          <code>
            {`// Express route for refreshing access tokens
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, 'refreshSecret', (err, user) => {
    if (err) return res.sendStatus(403);
    const newAccessToken = jwt.sign({ userId: user.userId }, 'accessSecret', { expiresIn: '15m' });
    res.json({ accessToken: newAccessToken });
  });
});`}
          </code>
        </pre>
      </div>
    ),
  },

  {
    question: "How can I secure routes in Express using JWT?",
    answer: (
      <div>
        To secure routes in Express using JWT, create a middleware function that
        verifies the token before allowing access to the route.
        <pre>
          <code>
            {`// JWT Middleware for securing routes
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  jwt.verify(token, 'yourSecretKey', (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
};

// Use the middleware in your route
app.get('/secure-route', authenticateToken, (req, res) => {
  res.send('This is a secure route');
});`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I create a bar chart using react-chartjs-2?",
    answer: (
      <div>
        To create a bar chart with `react-chartjs-2`, use the `Bar` component
        and pass in the necessary data and configuration options.
        <pre>
          <code>
            {`import React from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'Votes',
      data: [12, 19, 3],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const BarChart = () => <Bar data={data} options={options} />;

export default BarChart;`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I sign and verify JWT tokens in Node.js?",
    answer: (
      <div>
        Use the `jsonwebtoken` package to sign and verify JWT tokens. The
        signing process involves creating a token with a payload and a secret
        key.
        <pre>
          <code>
            {`const jwt = require('jsonwebtoken');

// Signing a token
const user = { id: 1, name: 'John' };
const token = jwt.sign(user, 'secretKey', { expiresIn: '1h' });

// Verifying a token
jwt.verify(token, 'secretKey', (err, decoded) => {
  if (err) console.error('Token verification failed:', err);
  else console.log('Decoded token:', decoded);
});`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question:
      "How do I use multiple datasets in a line chart with react-chartjs-2?",
    answer: (
      <div>
        To use multiple datasets in a line chart, add multiple dataset objects
        to the `datasets` array in the chart data.
        <pre>
          <code>
            {`import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [65, 59, 80],
      borderColor: '#36A2EB',
      fill: false,
    },
    {
      label: 'Dataset 2',
      data: [28, 48, 40],
      borderColor: '#FF6384',
      fill: false,
    },
  ],
};

const MultiLineChart = () => <Line data={data} />;

export default MultiLineChart;`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I handle errors when verifying JWT tokens in Express?",
    answer: (
      <div>
        Use a try-catch block or the error-first callback in the `jwt.verify()`
        method to handle errors when verifying tokens in Express.
        <pre>
          <code>
            {`const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, 'secretKey');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

app.get('/protected', verifyToken, (req, res) => {
  res.send('This is a protected route');
});`}
          </code>
        </pre>
      </div>
    ),
  },
  {
    question: "How do I create a responsive grid layout using CSS Grid?",
    answer: (
      <div>
        To create a responsive grid layout, define columns and rows using grid
        template properties and set them to adjust based on the screen size:
        <pre>
          <code>
            {`/* CSS Grid layout with responsive columns */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.item {
  background-color: #f4f4f4;
  padding: 20px;
  border: 1px solid #ddd;
}`}
          </code>
        </pre>
        This code creates a responsive grid where items adjust their size based
        on available space.
      </div>
    ),
  },
  {
    question: "How can I center an element both vertically and horizontally?",
    answer: (
      <div>
        To center an element within its parent container, you can use CSS Grid
        or Flexbox:
        <pre>
          <code>
            {`/* Centering with Flexbox */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Centering with Grid */
.container {
  display: grid;
  place-items: center;
  height: 100vh;
}`}
          </code>
        </pre>
        Both approaches achieve vertical and horizontal centering efficiently.
      </div>
    ),
  },
  {
    question: "How do I create a rain animation using CSS?",
    answer: (
      <div>
        To create a rain effect, you can use CSS keyframe animations with
        pseudo-elements to simulate raindrops:
        <pre>
          <code>
            {`/* CSS Rain effect */
@keyframes rain {
  0% {
    transform: translateY(-100%);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

.rain {
  position: relative;
  overflow: hidden;
  height: 100vh;
}

.drop {
  position: absolute;
  top: 0;
  width: 2px;
  height: 20px;
  background: rgba(0, 0, 255, 0.5);
  animation: rain 1s linear infinite;
}

.drop:nth-child(1) {
  left: 10%;
  animation-duration: 1.2s;
}

.drop:nth-child(2) {
  left: 30%;
  animation-duration: 0.9s;
}

.drop:nth-child(3) {
  left: 50%;
  animation-duration: 1.5s;
}

.drop:nth-child(4) {
  left: 70%;
  animation-duration: 1.3s;
}`}
          </code>
        </pre>
        This code creates falling raindrop animations at different speeds and
        positions.
      </div>
    ),
  },
];

const QuestionsPage = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box className="questions-page-container">
      <Navbar />
      <Typography variant="h4" gutterBottom>
        LLM Page - Q/A
      </Typography>
      <Paper elevation={3} className="questions-paper">
        <List>
          {questionsWithAnswers.map((qa, index) => (
            <div key={index}>
              <ListItem button onClick={() => toggleExpand(index)}>
                <ListItemText primary={qa.question} />
              </ListItem>
              <Collapse
                in={expandedIndex === index}
                timeout="auto"
                unmountOnExit
              >
                <Box className="answer-box">{qa.answer}</Box>
              </Collapse>
            </div>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default QuestionsPage;
