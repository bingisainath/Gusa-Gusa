require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const connectDB = require("./config/connectDB");
const router = require("./routes/index");

const app = express();

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
// Middleware to parse JSON and URL-encoded data
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);

app.get("/", (request, response) => {
  response.json({
    message: "Server running at " + PORT,
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running at " + PORT);
  });
});
