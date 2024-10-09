"use strict";

const mongoose = require("mongoose");

// const connectString = "mongodb://localhost:28017/shopDEV";

const connectString = "mongodb://root:123456@localhost:27019";
mongoose
  .connect(connectString)
  .then(() => {
    mongoose.connection.useDb("shopDEV");
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Error connecting to MongoDB", err));

if (1 === 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.export = mongoose;
