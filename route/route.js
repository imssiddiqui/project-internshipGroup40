const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")


router.get("/test-me", function(req, res) {
    res.send("My first ever api!")
})

router.post("createAuthor", authorController.createAuthor)