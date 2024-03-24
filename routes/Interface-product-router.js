const express=require("express")
const router=express.Router();
// const {check}=require('express-validator')
const InterfaceController=require('../controller/interface-controller')
// const uploadFile=require("../middleWare/uploadFile");

router.get('/getInterfaceProduct',InterfaceController.getInterfaceProduct);

router.post('/add',InterfaceController.addInterfaceProduct1)
module.exports=router


