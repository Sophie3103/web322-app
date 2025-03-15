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
const express = require("express");
const path = require("path");
const storeService = require("./store-service");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

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

app.get("/items", (req, res) => {
  if (req.query.category) {
    storeService
      .getItemsByCategory(req.query.category)
      .then((filteredItems) => {
        res.json(filteredItems);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
  else if (req.query.minDate) {
    storeService
      .getItemsByMinDate(req.query.minDate)
      .then((filteredItems) => {
        res.json(filteredItems);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
  else {
    storeService
      .getAllItems()
      .then((allItems) => {
        res.json(allItems);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
});
app.get("/item/:id", (req, res) => {
  storeService
    .getItemById(req.params.id)
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      res.json({ message: err });
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
