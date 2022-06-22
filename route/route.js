const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogcontroller")


router.get("/test-me", function(req, res) {
    res.send("My first ever api!")
})

router.post("/authors", authorController.createAuthor)
router.post("/blogs", blogController.createBlog)
router.get("/getData", blogController.GetData)
router.put("/updateDetails/:blogId", blogController.updateDetails)
router.delete("/blogs/:blogId", blogController.deleteBlogById)
router.delete('/blogs', blogController.deleteByQuery)

module.exports = router;