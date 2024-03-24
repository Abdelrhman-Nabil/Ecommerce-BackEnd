const express=require("express");
const userController=require("../controller/user-controller");
const { check } = require('express-validator');
const fileUpload=require("../middleWare/uploadFile")
const router=express.Router();
router.get('/:uid',userController.getUserById);

router.post('/signUp',fileUpload.single("image"),[
    check('name',"address").not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:10})
],userController.signUp)


router.post('/logIn',userController.logIn)
module.exports=router
