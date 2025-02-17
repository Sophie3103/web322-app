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

const express = require("express");
const path = require("path");
const storeService = require("./store-service");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get("/shop", (req, res) => {
  storeService
    .getPublishedItems()
    .then((publishedItems) => {
      res.json(publishedItems);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/items", (req, res) => {
  storeService
    .getAllItems()
    .then((allItems) => {
      res.json(allItems);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/categories", (req, res) => {
  storeService
    .getCategories()
    .then((allCategories) => {
      res.json(allCategories);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

storeService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("Express http server listening on port " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("Unable to start server: " + err);
  });
