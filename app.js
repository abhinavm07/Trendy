const express = require("express");
const app = express();
const port = 5000;
const route = require("./routes/routeTasks");

app.use("/", route);

app.listen(port, () => {
  console.log("And We're LIVE !");
});
console.log("Hello There");
