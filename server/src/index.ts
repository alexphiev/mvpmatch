import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { dataSource } from "./config/database";
import Router from "./routes";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("ENV");
console.log(process.env);

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json());

// Adding Helmet to enhance your API's security
app.use(helmet());

// Enabling CORS for all requests
app.use(cors());

// Logging of every http request
app.use(morgan("dev"));

// Static files in public folder
app.use(express.static("public"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.use(Router);
dataSource.initialize();

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
