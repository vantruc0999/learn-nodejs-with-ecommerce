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

module.exports = {
  getInfoData,
  getSelectData,
  omitData,
};
