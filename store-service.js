/*********************************************************************************
WEB322 – Assignment 05
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Sofiia Parkhomenko
Student ID: 123054215
Date: 03/31/2025
Vercel Web App URL: https://vercel.com/sophie3103s-projects/web322-app
GitHub Repository URL: https://github.com/Sophie1303/web322-app.git 

********************************************************************************/

const { Sequelize, Op } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'data', 'database.sqlite')  
});

const Item = require('./models/Item')(sequelize);
const Category = require('./models/Category')(sequelize);

function initialize() {
  return sequelize.sync();
}

function getCategories() {
  return Category.findAll();
}

function getAllItems() {
  return Item.findAll();
}

function getPublishedItems() {
  return Item.findAll({
    where: { published: true }
  });
}

function getItemsByCategory(category) {
  return Item.findAll({
    where: { category: category }
  });
}

function getItemsByMinDate(minDateStr) {
  return Item.findAll({
    where: {
      postDate: {
        [Op.gte]: minDateStr
      }
    }
  });
}

function getItemById(id) {
  return Item.findByPk(id);
}

function addItem(itemData) {
  itemData.published = itemData.published ? true : false;
  if (itemData.category) {
    itemData.category = parseInt(itemData.category);
  }
  if (!itemData.postDate) {
    itemData.postDate = new Date().toISOString().split("T")[0];
  }
  return Item.create(itemData);
}

function getPublishedItemsByCategory(category) {
  return Item.findAll({
    where: {
      published: true,
      category: category
    }
  });
}

function addCategory(categoryData) {
  return Category.create(categoryData);
}

module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  addItem,
  getItemsByCategory,
  getItemsByMinDate,
  getItemById,
  getPublishedItemsByCategory,
  addCategory
};
