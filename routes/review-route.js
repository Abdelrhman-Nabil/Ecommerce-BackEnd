const express=require("express")
const router=express.Router();
const reviewController=require("../controller/review-controller")
router.get('/product/:pid',reviewController.getRviewByProductId);
router.get('/getAllreview',reviewController.getAllreview);
router.post('/',reviewController.addReview);
router.delete('/:pid',reviewController.deleteReview);

module.exports=router
