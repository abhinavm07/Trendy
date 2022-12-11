const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./db/connect");

const port = process.env.PORT || 6000;
const route = require("./routes/routeTasks");

app.use("/", route);

const dbConnected = async (url) => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log("And We're LIVE !");
    });
    console.log("Hello There");
  } catch (error) {
    console.log(error);
  }
};

dbConnected();
