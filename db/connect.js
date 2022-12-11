const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const db = (url) => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB Connected"))
    .catch((err) => {
      console.log(err);
    });
};

module.exports = db;
