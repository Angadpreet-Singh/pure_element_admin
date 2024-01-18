import express from "express";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import * as path from "path";
var cors = require("cors");
import logger from "./config/winston";
import dataFilter from "./middleware/filter";
const app = express();

require("dotenv").config();

/* Cors middelware */
app.use(cors());

// Set Global Variable
if (process.env.APP_ENV === "prod") {
  global.config = require("./config/config.prod");
} else {
  global.config = require("./config/config.local");
}

/* system out middelware */
app.use(morgan("dev"));

/* express middelware for body requests */
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(express.urlencoded({ extended: false }));

app.set("etag", false);

/* Express middelware */
app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

app.use("/public", express.static(path.join(__dirname, "public")));

// Apply GET api Filter Data
app.use(dataFilter);

/* Routes*/
// Set Global Variable
if (process.env.APP_ENV === "prod") {
  app.use("/", require("./routes/index.routes"));
} else {
  app.use("/api", require("./routes/index.routes"));
}

app.get("/*", (req, res) => {
  res.status(404).send("We couldn't find the endpoint you were looking for!");
});

/* Error handler (next) */
app.use(function (err, req, res, next) {
  // console.log(err);
  logger.error(JSON.stringify(err));
  res.statusMessage = err;
  res
    .status(500)
    .send({ status: "error", message: "Server error", error: err });
});



export default app;
