/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Sofiia Parkhomenko
Student ID: 123054215
Date: 02/16/2025
Vercel Web App URL: 
GitHub Repository URL: 

********************************************************************************/

const fs = require("fs");

let items = [];
let categories = [];

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/items.json", "utf8", (err, data) => {
      if (err) {
        reject("Unable to read items.json file!");
        return;
      }
      try {
        items = JSON.parse(data);
      } catch (parseErr) {
        reject("Error parsing items.json file!");
        return;
      }

      fs.readFile("./data/categories.json", "utf8", (err, data) => {
        if (err) {
          reject("Unable to read categories.json file!");
          return;
        }
        try {
          categories = JSON.parse(data);
        } catch (parseErr) {
          reject("Error parsing categories.json file!");
          return;
        }
        resolve("Data successfully loaded");
      });
    });
  });
}

function getAllItems() {
  return new Promise((resolve, reject) => {
    if (items.length > 0) {
      resolve(items);
    } else {
      reject("no results returned");
    }
  });
}

function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = items.filter((item) => item.published === true);
    if (publishedItems.length > 0) {
      resolve(publishedItems);
    } else {
      reject("no results returned");
    }
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length > 0) {
      resolve(categories);
    } else {
      reject("no results returned");
    }
  });
}

module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories
};
