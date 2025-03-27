/*********************************************************************************
WEB322 – Assignment 04
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Sofiia Parkhomenko
Student ID: 123054215
Date: 03/26/2025
Vercel Web App URL: https://vercel.com/sophie3103s-projects/web322-app
GitHub Repository URL: https://github.com/Sophie1303/web322-app.git

********************************************************************************/
const sanitizeHtml = require("sanitize-html");
const express = require("express");
const path = require("path");
const storeService = require("./store-service");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const app = express();
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  let route = req.path.replace(/\/$/, "");
  res.locals.activeRoute = route === "" ? "/" : route;
  next();
});

cloudinary.config({
  cloud_name: "daxpgprze",
  api_key: "999964125187316",
  api_secret: "BmpyIgGUILXl8EGvsJJYQJtBfqg",
  secure: true
});

const upload = multer();

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {

  res.render("about");
});

app.get("/shop", (req, res) => {
  let cat = req.query.category;

  const itemsPromise = cat
    ? storeService.getPublishedItemsByCategory(cat)
    : storeService.getPublishedItems();

  const categoriesPromise = storeService.getCategories();

  Promise.all([itemsPromise, categoriesPromise])
    .then(([publishedItems, allCategories]) => {
      res.render("shop", {
        items: publishedItems,
        categories: allCategories
      });
    })
    .catch(() => {
      res.render("shop", {
        items: [],
        categories: [],
        message: "Error loading shop data."
      });
    });
});


app.get("/categories", (req, res) => {
  storeService.getCategories()
    .then((cats) => {
      res.render("categories", { categories: cats });
    })
    .catch(() => {
      res.render("categories", { categories: [], message: "No results" });
    });
});


app.get("/items", (req, res) => {
  if (req.query.category) {
    storeService.getItemsByCategory(req.query.category)
      .then((filteredItems) => {
        res.render("items", { items: filteredItems });
      })
      .catch((err) => {
        res.render("items", { items: [], message: "No results found." });
      });
  } else {
    storeService.getAllItems()
      .then((allItems) => {
        res.render("items", { items: allItems });
      })
      .catch((err) => {
        res.render("items", { items: [], message: "No results found." });
      });
  }
});


app.get("/item/:id", (req, res) => {
  storeService
    .getItemById(req.params.id)
    .then((item) => {
      res.render("singleItem", { item: item });
    })
    .catch((err) => {
      res.render("singleItem", { item: null, message: "No results found." });
    });
});

app.post("/items/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    async function upload(req) {
      let result = await streamUpload(req);
      return result;
    }
    upload(req)
      .then((uploaded) => {
        processItem(uploaded.url);
      })
      .catch((err) => {
        console.log(err);
        processItem(""); 
      });
  } else {
    processItem("");
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;
    storeService.addItem(req.body)
      .then(() => {
        res.redirect("/items");
      })
      .catch((err) => {
        res.send(err);
      });
  }
});
app.get("/items/add", (req, res) => {
  res.render("addItem"); 
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
