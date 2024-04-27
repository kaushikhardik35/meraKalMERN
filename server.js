const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();

const app = express();

app.use(bodyParser.json());

const mongodbURI =
  process.env.MONGODB_URL || "mongodb://localhost:27017/mydatabase";

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Live on port ${PORT}`);
});
