const express=require("express")
const router=express.Router();
const {check}=require('express-validator')
const ProductController=require('../controller/proudct-controller')
const uploadFile=require("../middleWare/uploadFile")
const CheckAuth=require("../middleWare/check-auth")

router.get('/product/:pid',ProductController.getProductById);
router.get('/allProduct',ProductController.getAllProduct);

router.use(CheckAuth)

router.post('/',uploadFile.array('image', 5),[
    check("title","price","color","categories","Storage","categories").not().isEmpty(),
    check("details").isLength({ min: 10 }),
],ProductController.addProduct);
router.patch("/:pid",uploadFile.array('image', 5),[
    check("title","price","color","categories","Storage","categories").not().isEmpty(),
    check("details").isLength({ min: 10 }),
],ProductController.editProduct);
router.delete("/:pid",ProductController.deleteProduct);
module.exports=router

