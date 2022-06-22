const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");
const validator = require("../utils/validator")
    // const jwt = require("jsonwebtoken");


const createBlog = async function(req, res) {
    try {
        let requestBody = req.body;
        // const tokenId = req.authorId
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({
                status: false,
                messege: "Invalid request parameters. Please provide blog details",
            });
        }
        // extract parameters
        const { title, body, authorId, tags, category, subcategory, isPublished } = requestBody;


        //  Validation starts
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, messege: "Blog Title is required" });
        }
        if (!validator.isValid(body)) {
            return res.status(400).send({ status: false, messege: "Blog body is required" });
        }
        if (!validator.isValid(authorId)) {
            return res.status(400).send({ status: false, messege: "AuthorId is required" });
        }
        if (!validator.isValidObjectId(authorId)) {
            return res.status(400).send({
                status: false,
                messege: `${authorId} is not a valid author id`,
            });
        }

        const findAuthor = await authorModel.findById(authorId);
        if (!findAuthor) {
            return res
                .status(400)
                .send({ status: false, message: "Author does not exists." });
        }
        if (!validator.isValid(category)) {
            return res
                .status(400)
                .send({ status: false, message: "Blog category is required" });
        }
        //validation Ends

        const blogData = {
            title,
            body,
            authorId,
            category,
            isPublished: isPublished ? isPublished : false,
            publishedAt: isPublished ? new Date() : null,
        };

        // if (tags) {
        //     if (Array.isArray(tags)) {
        //         const uniqueTagArr = [...new Set(tags)];
        //         blogData["tags"] = uniqueTagArr; //Using array constructor here
        //     }
        // }

        // if (subcategory) {
        //     if (Array.isArray(subcategory)) {
        //         const uniqueSubcategoryArr = [...new Set(subcategory)];
        //         blogData["subcategory"] = uniqueSubcategoryArr; //Using array constructor here
        //     }
        // }

        const newBlog = await blogModel.create(blogData);
        return res.status(201).send({
            status: true,
            message: "New blog created successfully",
            data: newBlog,
        });

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

module.exports = {
    createBlog
}