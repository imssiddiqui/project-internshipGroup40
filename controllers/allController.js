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

////////////////////createCollege///////////////////////

const createCollege = async function (req, res) {

    try {
    const data = req.body
    
    if (!isValidRequestBody(data)){
        res.status(400).send({ status: false, msg : "Invalid request parameters. Please provide college details"});
        return;
    }

    let {name, fullName, logoLink, isDeleted} = data;

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
    
    if(!(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(logoLink))){
    res.status(400).send({ status: false, message: 'Please provide valid URL'})
    return;
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

///////////////////createIntern/////////////////////

const createIntern = async function (req, res) {

    try {
            const data = req.body;
            
             if (!isValidRequestBody(data)){
        res.status(400).send({ status: false, msg : "Invalid request parameters. Please provide intern details"});
        return;
    }

     const  {name, email, mobile, collegename, isDeleted} = data; //destructuring

     if (!isValid(name)) {
        return res.status(400).send({status: false, msg: "Please enter intern's name!!"})
    };

    if (!isValid(email)) {
        return res.status(400).send({status: false, msg: "Please enter email address!!"})
    };

    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)){
        return res.status(400).send({ status: false, msg: "Please provide valid email address in correct format"})
    }

    const isemailAlreadyUsed = await internModel.findOne({email}) 
        if (isemailAlreadyUsed) {
            return res.status(400).send({ status: false, msg: "This email is already registered!"})
        }

    if (!isValid(mobile)) {
        return res.status(400).send({status: false, msg: "Please enter mobile number!!"})
    };

    if (/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) {
        return res.status(400).send({status: true, msg: "Please enter valid mobile number!"})
    }

    const isMobileNumberAlreadyUsed = await internModel.findOne({mobile}) 
        if (isMobileNumberAlreadyUsed) {
            return res.status(400).send({ status: false, msg: "This mobile number is already registered!"})
        }

    if (isDeleted == true) {
        return res.status(400).send({status: false, msg: "Can not input isDeleted as true while registering"})
    };

    if (!isValid(collegename)) {
        return res.status(400).send({status: false, msg: "Please enter college name!!"})
    };

    let isCollegeId = await collegeModel.findOne({name: data.collegename}).select({_id: 1})
        if (!isCollegeId) {
            return res.status(404).send({status: false, msg: "This college name does not exist!"})
        }
        
        let id = isCollegeId._id.toString()
        data.collegeId = id

        //isDeleted data.collegename

     const newIntern = await internModel.create(data)
    res.status(201).send({ status: true, msg: "intern successfully created!", data: newIntern })
    }


    catch(err) {
        res.status(500).send({status : false, error : err.message})
    }
}

const getCollegeDetails = async function (req, res) {
    try {
        let collegename = req.query.name
        if (!collegename){
        return res.status(404).send({status: false, msg: "Please provide college name in query."})}

        const collegedata = await collegeModel.findOne({name: collegename}).select({name: 1, fullName: 1, logoLink: 1})
        if(!collegedata){
        return res.status(404).send({status: false, msg: "No such college data found."})}

        const interndata = await internModel.find({collegeName: collegeModel.name}).select({ name: 1, email: 1, mobile: 1 });
        if(!interndata){
        return res.status(404).send({status: false, msg: "No such intern found."})}

        
        Object.assign(collegedata._doc, { interns : interndata });
        res.status(200).send({status: true, data: collegedata});

    }

    catch (err) {
         res.status(500).send({status : false, error : err.message})
    }
}



module.exports.createCollege = createCollege
module.exports.createIntern = createIntern
module.exports.getCollegeDetails = getCollegeDetails