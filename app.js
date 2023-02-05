const readClinet = require("./twitterClient");

const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
require("express-async-errors");
const notfoundMiddleware = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const connectDB = require("./db/connect");

const port = process.env.PORT || 5000;
const route = require("./routes/routeTasks");

app.use(express.json());

app.use("/", route);
app.use(notfoundMiddleware);
app.use(errorHandler);

const dbConnected = async (url) => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`And We're LIVE at Port ${port} !`);
    });
    console.log("Hello There");
  } catch (error) {
    console.log(error);
  }
};

dbConnected();
