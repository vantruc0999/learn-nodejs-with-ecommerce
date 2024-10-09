"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
// const connectString = "mongodb://localhost:28017/shopDEV";

const connectString = "mongodb://root:123456@localhost:27019/";

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then((_) => {
        console.log("Connected to MongoDB", countConnect());
      })
      .catch((err) => console.log("Error connecting to MongoDB", err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
