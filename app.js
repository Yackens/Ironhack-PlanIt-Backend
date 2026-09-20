// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const rateLimit = require("express-rate-limit");
const { isAuthenticated } = require("./middleware/jwt.middleware");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const categoryRouter = require("./routes/categories.routes");
app.use("/api", isAuthenticated, categoryRouter);

const taskRouter = require("./routes/tasks.routes");
app.use("/api", isAuthenticated, taskRouter);   

const authRouter = require("./routes/auth.routes");

// Throttle the credential endpoints (/auth/login, /auth/signup) to slow down
// credential bruteforcing. Other /auth routes stay unthrottled.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." }
});

app.use("/auth/login", authLimiter);
app.use("/auth/signup", authLimiter);
app.use("/auth", authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
