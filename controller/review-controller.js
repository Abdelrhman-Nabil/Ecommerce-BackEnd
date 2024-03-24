const { validationResult } = require("express-validator");
const mongoose=require('mongoose')
const HttpError=require('../modals/http-error')
const Review=require("../modals/schema/review")
const Product=require("../modals/schema/product");


const getRviewByProductId=async(req,res,next)=>{
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed ,please check your data", 422)
    );
  }
  const ProductId = req.params.pid;
  let reviewWithProduct;
  try{
    reviewWithProduct=await Product.findById(ProductId).populate('reviewsId')

  } catch (err) {
    const error = new HttpError(
      "Fetching reviews failed ,please try again later",
      500
    );
    return next(error);
  }

  if (!reviewWithProduct || reviewWithProduct.reviewsId.length === 0) {
    return next(
      new HttpError("Couldn't find a review for the previos product ID", 404)
    );
  }
  res.json({
    review: reviewWithProduct.reviewsId.map((review) => review.toObject({ getters: true })),
  });
}
const getAllreview= async(req,res,next)=>{
    let reviews;
    try{
      reviews=Review.find({})
    }catch(err){
      const error=new HttpError("couldn't find the reviews.please try again",500);
    return next(error)
    }
    res.json({reviews:(await reviews).map(review=>review.toObject({getters:true}))})
}

const addReview=async(req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { value,title,details, productId ,date} = req.body;
  const createReview = new Review({
    value,title,details, productId,date
  });

  let product;
  try {
    product = await Product.findById(productId);
}
catch (err) {
    const error = new HttpError(
      'Creating review failed, please try again.',
      500
    );
    return next(error);
}

  if (!product) {
    const error = new HttpError('Could not find product for provided id.', 404);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createReview.save({ session: sess });
    product.reviewsId.push(createReview);
    await product.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating review failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ review: createReview });

}


const deleteReview=async(req,res,next)=>{
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed ,please check your data", 422)
    );
  }
    const reviewId = req.params.pid;
    let review;
    try{
        review=await Review.findByIdAndDelete(reviewId).populate('productId');

    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete email.',
        500
      );
      return next(error);
    }
    if(!review){
      const error= new HttpError("couldn't find a review that has the previos id")
    }
    try{
      const sess=await mongoose.startSession();
      sess.startTransaction();
      review.productId.review.pop(review);
      await review.productId.save({ session: sess });
      await sess.commitTransaction();

    }
    catch (err) {
      const error = new HttpError(
        'deleting review failed, please try again.',
        500
      );
      return next(error);
    }
  

    res.status(200).json({ message: 'Deleted review.' });

}
exports.getRviewByProductId=getRviewByProductId;
exports.getAllreview=getAllreview
exports.addReview=addReview
exports.deleteReview=deleteReview