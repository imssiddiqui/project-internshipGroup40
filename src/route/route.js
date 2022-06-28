const express = require('express');

const router = express.Router();

const allController = require("../controllers/allController")

router.post('/functionup/colleges', allController.createCollege)







module.exports = router