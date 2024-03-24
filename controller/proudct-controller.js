const { validationResult } = require("express-validator");
const mongoose=require('mongoose')
const HttpError=require('../modals/http-error')
const Product=require("../modals/schema/product")
const Review=require("../modals/schema/review");
const User=require("../modals/schema/users")
const getProductById=async(req,res,next)=>{
  const ProductId = req.params.pid;

  let product;
 try{
  product=await Product.findById(ProductId)
 }catch (err) {
  const error = new HttpError(
    "Something went wrong ,couldn't find a Product",
    500
  );
  return next(error);
}
if (!product) {
  const error = new HttpError(
    "Couldn't find a product for the previos product ID",
    404
  );
  return next(error);
}
res.json({ product: product.toObject({ getters: true }) }); // => { place } => { place: place }

}
const getAllProduct=async (req,res,next)=>{
    let products;
    try{
      products=Product.find({})
    }catch(err){
      const error=new HttpError("couldn't find the product.please try again",500);
    return next(error)
    }
    res.json({products:(await products).map(product=>product.toObject({getters:true}))})

}

const addProduct=async(req,res,next)=>{
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed ,please check your data", 422)
    );
  }
  const{title,price,color,categories,storage,details}=req.body;
  const path=req.files.map(i=>i.path)

  const createProduct=new Product({
    title,price,color,categories,storage,details,review:[],
    image:path,creator:req.userData.userId

  });
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed,,, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Couldn't find the user for provided id....", 400);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createProduct.save({ session: sess });
    user.products.push(createProduct);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed1, please try again.',
      500
    );
    return next(error);
  }
  res.status(201).json({ product: createProduct });
}

const editProduct=async(req,res,next)=>{
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed ,please check your data", 422)
    );
  }
    const{title,price,color,categories,storage,image,details}=req.body;
    const path=req.files.map(i=>i.path);
    const Images=image.concat(path)
    const productId = req.params.pid;
   let product;
   try{
 product=await Product.findById(productId);
}catch(err){
 const error = new HttpError(
      "Something went wrong ,please try again later",
      500
    );
    return next(error);
}
  
if(product.creator.toString() !== req.userData.userId){
  const error = new HttpError(
    "you are not allowed to edit in this product",
    401
  );
  return next(error);
}

product.title=title;
 product.price=price;
 product.color=color;
 product.categories=categories;
 product.storage=storage;
 product.details=details
 product.image=Images; 
 try {
  await product.save();
} catch (err) {
  const error = new HttpError(
    "Somthing went wrong ,couldn't updata place",
    500
  );
  return next(error)
}
res.status(200).json({ product: product.toObject({ getters: true }) });
};  


const deleteProduct = async (req, res, next) => {
    const productId = req.params.pid;
    let product,review;
    try{
      product=await Product.findByIdAndDelete(productId).populate("reviewsId");
      review=await Review.findByIdAndDelete(product.reviewsId).populate('productId');
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete product.',
        500
      );
      return next(error);
    }
    if(product.creator.id !== req.userData.userId){
      const error = new HttpError(
        "you are not allowed to delete in this place",
        401
      );
      return next(error);
    }try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      product.creator.products.pull(product);
      await product.creator.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete place.',
        500
      );
      return next(error);
    }
     res.status(200).json({ message: 'Deleted product.' });
  };
exports.getProductById=getProductById;
exports.getAllProduct=getAllProduct;
exports.addProduct=addProduct;
exports.editProduct=editProduct;
exports.deleteProduct=deleteProduct;