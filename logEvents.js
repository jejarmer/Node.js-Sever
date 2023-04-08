// Npm Modules
const { format } = require("date-fns");
const { v4: uuidv4 } = require("uuid");

// Core Node Modules
const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;

const logEvents = async (message) => {
  const dateTime = format(new Date(), "MM-dd-yyyy \t hh:mm:ss");
  const logItem = `${dateTime} \t ${message}`;
  try {
    console.log(logItem);
  } catch (err) {
    console.log(err);
  }
};

module.exports = logEvents;