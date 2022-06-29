const express = require('express');

const router = express.Router();

const allController = require("../controllers/allController")

router.post('/functionup/colleges', allController.createCollege)

router.post('/functionup/interns', allController.createIntern)

router.get('/functionup/collegeDetails', allController.getCollegeDetails)

module.exports = router