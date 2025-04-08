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
const sanitizeHtml = require("sanitize-html");
const express = require("express");
const path = require("path");
const storeService = require("./store-service");  
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const expressLayouts = require("express-ejs-layouts");

const app = express();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
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
        title: "Shop",
        items: publishedItems,
        categories: allCategories,
        message: publishedItems.length > 0 ? null : "No items found."
      });
    })
    .catch(() => {
      res.render("shop", {
        title: "Shop",
        items: [],
        categories: [],
        message: "Error loading shop data."
      });
    });
});

app.get("/categories", (req, res) => {
  storeService.getCategories()
    .then((cats) => {
      res.render("categories", {
        title: "Categories",
        categories: cats,
        message: cats.length ? null : "No categories found."
      });
    })
    .catch(() => {
      res.render("categories", {
        title: "Categories",
        categories: [],
        message: "Error loading categories."
      });
    });
});

app.get("/items", (req, res) => {
  const categoryQuery = req.query.category;

  Promise.all([
    categoryQuery ? storeService.getItemsByCategory(categoryQuery) : storeService.getAllItems(),
    storeService.getCategories()
  ])
  .then(([items, categories]) => {
    res.render("items", {
      title: "Items List",
      items,
      categories,
      message: items.length ? null : "No items found."
    });
  })
  .catch(() => {
    res.render("items", {
      title: "Items List",
      items: [],
      categories: [],
      message: "Error loading items."
    });
  });
});

app.get("/item/:id", (req, res) => {
  storeService.getItemById(req.params.id)
    .then((item) => {
      if (item) {
        res.render("singleItem", { title: "Item Details", item });
      } else {
        res.render("singleItem", { title: "Item Details", item: null, message: "No results found." });
      }
    })
    .catch(() => {
      res.render("singleItem", { title: "Item Details", item: null, message: "No results found." });
    });
});

app.get("/items/add", (req, res) => {
  storeService.getCategories()
    .then((categories) => {
      res.render("addItem", { title: "Add Item", categories });
    })
    .catch(() => {
      res.render("addItem", { title: "Add Item", categories: [] });
    });
});

app.post("/items/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function uploadFile(req) {
      let result = await streamUpload(req);
      return result;
    }

    uploadFile(req)
      .then((uploaded) => {
        processItem(uploaded.url);
      })
      .catch((err) => {
        console.error(err);
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

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

storeService.initialize()
  .then(async () => {
    console.log("MongoDB Atlas connected!");

    const existingItems = require("./data/items.json");
    const existingCategories = [
      { id: 1, category: "Home, Garden" },
      { id: 2, category: "Electronics, Computers, Video Games" },
      { id: 3, category: "Clothing" },
      { id: 4, category: "Sports & Outdoors" },
      { id: 5, category: "Pets" }
    ];

    const catCount = await storeService.getCategories();
    if (catCount.length === 0) {
      for (let c of existingCategories) {
        await storeService.addCategory(c);
      }
      console.log("Categories imported successfully!");
    }

    const itemCount = await storeService.getAllItems();
    if (itemCount.length === 0) {
      for (let i of existingItems) {
        await storeService.addItem(i);
      }
      console.log("Items imported successfully!");
    }

    const HTTP_PORT = process.env.PORT || 8080;
    app.listen(HTTP_PORT, () => {
      console.log("Express HTTP server listening on port " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.error("Unable to start server:", err);
  });