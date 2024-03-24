const { validationResult } = require("express-validator");
const HttpError=require('../modals/http-error')
const InterfaceProduct=require('../modals/schema/inretface-product')
const Product=require("../modals/schema/product")

const getInterfaceProduct=async (req,res,next)=>{
    let products;
    try{
      products=InterfaceProduct.find({})
    }catch(err){
      const error=new HttpError("couldn't find the product.please try again",500);
    return next(error)
    }
    res.json({products:(await products).map(products=>products.toObject({getters:true}))})

}


const addInterfaceProduct1=async(req,res,next)=>{
  const {id}=req.body
  
  const createInterfaceProduct=new InterfaceProduct({id})
  try{
    await createInterfaceProduct.save();
  }
  catch(err){
    const error = new HttpError("save Product filed, please try again.", 500);
      return next(error);
  }
  res.status(201).json({product:createInterfaceProduct})

}
  


exports.getInterfaceProduct=getInterfaceProduct;
exports.addInterfaceProduct1=addInterfaceProduct1;

/*
// const addInterfaceProduct=async (req,res,next)=>{
//   const error = validationResult(req);
//   if (!error.isEmpty()) {
//     return next(
//       new HttpError("Invalid inputs passed ,please check your data", 422)
//     );
//   }
//   const{title,price,color,categories,storage,details,image}=req.body;
//   const path=req.files.map(i=>i.path);

//   const createInterfaceProduct=new InterfaceProduct({
//     title,price,color,categories,storage,details,image
//     })
//   try{
//     await createInterfaceProduct.save();
//   }
//   catch(err){
//     const error = new HttpError("create prpduct filed, please try again.", 500);
//       return next(error);
//   }
//   res.status(201).json({product:createInterfaceProduct})
// }
*/