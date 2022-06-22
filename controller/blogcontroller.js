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

        if (tags) {
            if (Array.isArray(tags)) {
                const uniqueTagArr = [...new Set(tags)];
                blogData["tags"] = uniqueTagArr; //Using array constructor here
            }
        }

        if (subcategory) {
            if (Array.isArray(subcategory)) {
                const uniqueSubcategoryArr = [...new Set(subcategory)];
                blogData["subcategory"] = uniqueSubcategoryArr; //Using array constructor here
            }
        }

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

const GetData = async function(req, res) {
    try {
        let query = req.query; //as a object{authorId:surbhi,category:math}

        console.log(query);
        let GetRecord = await blogModel.find({
            $and: [{ isPublished: true, isDeleted: false, ...query }], //authorid:surbhi,category:math
        }).populate("authorId")
        if (GetRecord.length == 0) {
            return res.status(404).send({
                data: "No such document exist with the given attributes.",
            });
        }
        res.status(200).send({ status: true, data: GetRecord });
    } catch (err) {
        res.status(500).send({ status: false, data: err.message });
    }
};

// const updateBlog = async function(req, res) {


//Update blogs
const updateDetails = async function(req, res) {
    try {
        let authorIdFromToken = req.authorId;
        let blogId = req.params.blogId;
        let requestBody = req.body;
        const { title, body, tags, subcategory } = requestBody;

        if (!validator.isValidRequestBody(req.params)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide query details" });
        }


        if (!validator.isValidObjectId(blogId)) {
            return res
                .status(400)
                .send({ status: false, message: `BlogId is invalid.` });
        }

        if (!validator.isValidString(title)) {
            return res
                .status(400)
                .send({ status: false, message: "Title is required for updatation." });
        }

        if (!validator.isValidString(body)) {
            return res
                .status(400)
                .send({ status: false, message: "Body is required for updatation." });
        }

        if (tags) {
            if (tags.length === 0) {
                return res
                    .status(400)
                    .send({ status: false, message: "tags is required for updatation." });
            }
        }

        if (subcategory) {
            if (subcategory.length === 0) {
                return res.status(400).send({
                    status: false,
                    message: "subcategory is required for updatation.",
                });
            }
        }

        let Blog = await blogModel.findOne({ _id: blogId });
        if (!Blog) {
            return res.status(400).send({ status: false, msg: "No such blog found" });
        }
        // if (Blog.authorId.toString() !== authorIdFromToken) {
        //     res.status(401).send({
        //         status: false,
        //         message: `Unauthorized access! author's info doesn't match`,
        //     });
        //     return;
        // }
        if (
            req.body.title ||
            req.body.body ||
            req.body.tags ||
            req.body.subcategory
        ) {
            const title = req.body.title;
            const body = req.body.body;
            const tags = req.body.tags;
            const subcategory = req.body.subcategory;
            const isPublished = req.body.isPublished;

            const updatedBlog = await blogModel.findOneAndUpdate({ _id: req.params.blogId }, {
                title: title,
                body: body,
                $addToSet: { tags: tags, subcategory: subcategory },
                isPublished: isPublished,
            }, { new: true });
            if (updatedBlog.isPublished == true) {
                updatedBlog.publishedAt = new Date();
            }
            if (updatedBlog.isPublished == false) {
                updatedBlog.publishedAt = null;
            }
            return res.status(200).send({
                status: true,
                message: "Successfully updated blog details",
                data: updatedBlog,
            });
        } else {
            return res
                .status(400)
                .send({ status: false, msg: "Please provide blog details to update" });
        }
    } catch (err) {
        res.status(500).send({
            status: false,
            Error: err.message,
        });
    }
};
//     try {
//         const blogId = req.params.blogId;
//         const details = req.body;
//         if (!blogId) {
//             return res
//                 .status(400)
//                 .send({ status: false, data: "Please enter a blog id" });
//         }
//         if (details.category || details.authorId) {
//             return res.status(400).send({
//                 status: false,
//                 data: "You cannot change authorId or category",
//             });
//         }
//         const updatedDetails = await blogModel.findOneAndUpdate({ _id: blogId }, {
//             title: details.title,
//             body: details.body,
//             $push: {
//                 tags: details.tags,
//                 subcategory: details.subcategory
//             },
//             isPublished: true,
//             publishedAt: new Date(),
//         }, { new: true, upsert: true });
//         res.status(200).send({ status: true, data: updatedDetails });
//     } catch (err) {
//         console.log("This is the error 1", err.message);
//         res.status(500).send({ status: false, data: err.message });
//     }
// };

const deleteBlogById = async function(req, res) {

    try {
        let id = req.params.blogId;
        if (!validator.isValidObjectId(id)) {
            return res
                .status(400)
                .send({ status: false, message: " BlogId is invalid." });
        }

        let data = await blogModel.findOne({ _id: id });
        if (!data) {
            return res.status(400).send({ status: false, message: "No such blog found" })
        }
        let Update = await blogModel.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedAt: Date() }, { new: true })
        res.status(200).send({ status: true, dataa: Update })
    } catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}
const deleteByQuery = async function(req, res) {
    try {
        let category = req.query.category
        let authorId = req.query.authorId
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        let isPublished = req.query.isPublished
        if (!validator.isValidRequestBody(req.query)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide query details" });
        }

        if (authorId) {
            if (!validator.isValidObjectId(authorId)) {
                return res.status(401).send({ status: false, message: "authorId is not valid." });
            }
        }
        let data = await blogModel.find({ $or: [{ category: category }, { authorId: authorId }, { tags: tags }, { subcategory: subcategory }, { isPublished: isPublished }] });
        if (!data) {
            return res.status(403).send({ status: false, message: "no such data exists" })
        }
        let Update = await blogModel.updateMany({ $or: [{ category: category }, { authorId: authorId }, { tags: tags }, { subcategory: subcategory }, { isPublished: isPublished }] }, { $set: { isDeleted: true } }, { new: true })
        res.send({ status: true, data: Update })
    } catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }

}

module.exports = {
    createBlog,
    GetData,
    updateDetails,
    deleteBlogById,
    deleteByQuery
}


// arr = [1, 2, 3]
// const [a, b, ...n] = [1, 2, 3]
// console.log(a)
// console.log(b)
// console.log(n)