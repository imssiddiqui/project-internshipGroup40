const authorModel = require('../model/authorModel.js')
const blogModel = require('../model/blogModel.js')
const jwt = require('jsonwebtoken')
const secretKey = "Functionup-Radon"

const loginCheck = async function(req, res, next) {
    try {

        let token = req.headers['x-api-key'] || req.headers['X-api-key']
        if (!token) {
            return res.status(403).send({ status: false, message: "token must be present" })
        }

        let decoded = jwt.verify(token, secretKey)

        if (!decoded) {
            return res.status(403).send({ status: false, message: "token is not valid" })
        }

        req.authorId = decoded.authorId
        next()
    } catch (error) {
        res.status(500).send({ status: false, Error: "Provide Valid token" })
    }
}
const authorise = async function(req, res, next) {
    try {

        let token = req.headers['x-api-key'] || req.headers['X-api-key']
        if (!token) {
            return res.status(403).send({ status: false, message: "token must be present in the request header" })
        }



        let decoded = jwt.verify(token, secretKey)

        if (!decoded) {
            return res.status(403).send({ status: false, message: "token is not valid" })
        }
        let authorToBeModified = req.params.authorId;
        let authorLoggedIn = decodedToken.authorId;
        if (authorToBeModified != authorLoggedIn) return res.send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })


        next()
    } catch (error) {
        res.status(500).send({ status: false, Error: "Provide Valid token" })
    }
}

module.exports = {
    loginCheck,
    authorise
}