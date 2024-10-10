"use strict";

const express = require("express");
const router = express.Router();

// router.get("/", (req, res, next) => {
//   const strCompress = "Hello";
//   return res.status(200).json({
//     message: "Hehe",
//     metadata: strCompress.repeat(10),
//   });
// });

router.use("/v1/api", require("./auth"));

module.exports = router;
