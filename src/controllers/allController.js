const mongoose = require('mongoose')

const collegeModel = require('../models/collegeModel')

const internModel = require('../models/internModel')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null )return false;
    if (typeof value === 'string' && value.trim().length === 0) return false;
    return true;
};

const isValidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0;
};

const isValidObjectId = function (ObjectId){
return mongoose.Types.ObjectId.isValid(ObjectId);
};

const createCollege = async function (req, res) {

    try {
    const data = req.body
    
    if (!isValidRequestBody(data)){
        res.status(400).send({ status: false, msg : "Invalid request parameters. Please provide college details"});
        return;
    }

    let {name, fullName, logoLink} = data;

    //extract params

    if (!isValid(name)) {
        return res.status(400).send({status: false, msg: "Please enter college name!!"})
    };

    if (!isValid(fullName)) {
        return res.status(400).send({status: false, msg: "Please enter college full name!"})
    }; 

    if (!isValid(logoLink)) {
        return res.status(400).send({status: false, msg: "Please enter college logo link!!"})
    };

    if (isDeleted == true) {
        return res.status(400).send({status: false, msg: "Can not input isDeleted as true while registering"})
    };

    const isFullNameAlreadyUsed = await collegeModel.findOne({fullName}) 
        if (isFullNameAlreadyUsed) {
            return res.status(400).send({ status: false, msg: "This college fullname is already registered!"})
        }
    
    const isNameAlreadyUsed = await collegeModel.findOne({name}) 
        if (isNameAlreadyUsed) {
            return res.status(400).send({ status: false, msg: "This college name is already registered!"})
        }

    const savedData = await collegeModel.create(data)
    res.status(201).send({ status: true, msg: "college successfully created!", data: savedData })
}

catch (err) {
    res.status(500).send({status : false, error : err.message})
}
};



mongoose.exports.createCollege = createCollege