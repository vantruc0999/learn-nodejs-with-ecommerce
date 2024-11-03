"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((element) => [element, 1]));
};

const omitData = (select = []) => {
  return Object.fromEntries(select.map((element) => [element, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  console.log("ob1[1]::", obj);
  Object.keys(obj).forEach((k) => {
    console.log(typeof obj[k]);
    console.log("[3]::", k);
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        console.log("[4]::", a);

        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  console.log("ob1[2]::", final);

  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  omitData,
  removeUndefinedObject,
  updateNestedObjectParser,
};
