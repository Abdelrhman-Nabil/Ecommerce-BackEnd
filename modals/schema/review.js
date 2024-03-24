const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const ReviewSchema=new Schema({
    value:{type:Number ,require:true},
    title:{type:String ,require:true},
    details:{type:String ,require:true, minlength:6},
    date:{type:String ,require:true},
    productId: { type: mongoose.Types.ObjectId, required: true, ref: 'Product'},
}); 
module.exports=mongoose.model('Review',ReviewSchema)