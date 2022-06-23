const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogcontroller")
const MW = require("../middleware/Auth")

router.get("/test-me", function(req, res) {
    res.send("My first ever api!")
})

router.post("/authors", authorController.createAuthor)
router.post("/login", authorController.loginAuthor)
router.post("/blogs", MW.loginCheck, blogController.createBlog)
router.get("/blogs", MW.loginCheck, blogController.GetData)
router.put("/blogs/:blogId", MW.loginCheck, MW.authorise, blogController.updateDetails)
router.delete("/blogs/:blogId", MW.loginCheck, MW.authorise, blogController.deleteBlogById)
router.delete("/blogs", MW.loginCheck, blogController.deleteByQuery)

module.exports = router;