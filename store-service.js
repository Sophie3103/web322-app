/*********************************************************************************
WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Sofiia Parkhomenko
Student ID: 123054215
Date: 03/15/2025
Vercel Web App URL: https://vercel.com/sophie3103s-projects/web322-app
GitHub Repository URL: https://github.com/Sophie1303/web322-app.git 

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

function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filtered = items.filter((item) => item.category == category);
    if (filtered.length > 0) resolve(filtered);
    else reject("no results returned");
  });
}

function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const filtered = items.filter(
      (item) => new Date(item.postDate) >= new Date(minDateStr)
    );
    if (filtered.length > 0) resolve(filtered);
    else reject("no results returned");
  });
}

function getItemById(id) {
  return new Promise((resolve, reject) => {
    const found = items.find((itm) => itm.id == id);
    if (found) resolve(found);
    else reject("no result returned");
  });
}
function addItem(itemData) {
  return new Promise((resolve, reject) => {
    itemData.published = itemData.published ? true : false;

    if (itemData.category) {
      itemData.category = parseInt(itemData.category);
    }

    if (!itemData.postDate) {
      itemData.postDate = new Date().toISOString().split("T")[0];
    }

    itemData.id = items.length + 1;

    items.push(itemData);

    resolve(itemData);
  });
}



module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  addItem,
  getItemsByCategory,
  getItemsByMinDate,
  getItemById
};
