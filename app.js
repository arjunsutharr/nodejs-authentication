import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";
import session from "express-session";
import { connectToDatabase } from "./src/config/db.js";
import userRoutes from "./src/routes/user.routes.js";
import { auth } from "./src/middlewares/auth.middlerware.js";
import { invalidRoutesHandlerMiddleware } from "./src/middlewares/invalidRoutesHandler.middleware.js";
import { ErrorHandlerMiddleware } from "./src/middlewares/errorHandler.middleware.js";

const app = express();

app.use(express.static("src/views"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// viw engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("src", "views"));
app.use(expressEjsLayouts);

// set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

//Mount routes
app.use("/user", userRoutes);

// Default request handler
app.use("/", auth, (req, res, next) => {
  res.status(200).redirect("user");
});

// Error Handler middleware
app.use(ErrorHandlerMiddleware);

// Invalid routes handler middleware
app.use(invalidRoutesHandlerMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`server is listening on: http://localhost:${process.env.PORT}`);
  connectToDatabase();
});
