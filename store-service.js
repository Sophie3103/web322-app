/*********************************************************************************
WEB322 – Assignment 06
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Sofiia Parkhomenko
Student ID: 123054215
Date: 04/07/2025
Vercel Web App URL: https://vercel.com/sophie3103s-projects/web322-app
GitHub Repository URL: https://github.com/Sophie1303/web322-app.git 

********************************************************************************/
const mongoose = require('mongoose');
const ItemModel = require('./models/Item');       
const CategoryModel = require('./models/Category'); 

function initialize() {
  return mongoose.connect('mongodb+srv://sparkhomenko:Dinaxy6996@cluster0.g7mlxxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB Atlas connected!'))
    .catch(err => console.error('Atlas connection error:', err));
}

function getCategories() {
  return CategoryModel.find().lean();
}

function addCategory(categoryData) {
  return CategoryModel.create(categoryData);
}

function getAllItems() {
  return ItemModel.find().lean();
}

function getPublishedItems() {
  return ItemModel.find({ published: true }).lean();
}

function getItemsByCategory(category) {
  return ItemModel.find({ category }).lean();
}

function getItemById(id) {
  return ItemModel.findById(id).lean();
}

function addItem(itemData) {
  itemData.published = !!itemData.published;

  if (!itemData.postDate) {
    itemData.postDate = new Date().toISOString().split("T")[0];
  }

  return ItemModel.create(itemData);
}

function getPublishedItemsByCategory(category) {
  return ItemModel.find({ published: true, category }).lean();
}

module.exports = {
  initialize,
  getCategories,
  addCategory,
  getAllItems,
  getPublishedItems,
  getItemsByCategory,
  getItemById,
  addItem,
  getPublishedItemsByCategory
};