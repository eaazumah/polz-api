import express from "express";
import compression from "compression"; // compresses requests
import bodyParser from "body-parser";
import userRouter from "./routes/routes.users";
import pollRouter from "./routes/routes.polls";

import * as apiController from "./controllers/api";

// API keys and Passport configuration
// import * as passportConfig from "./config/passport";

// Create Express server

const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Primary app routes.
 */

/**
 * API examples routes.
 */

app.use("/api/v1", userRouter);
app.use("/api/v1", pollRouter);

/**
 * OAuth authentication routes. (Sign in)
 */

export default app;
