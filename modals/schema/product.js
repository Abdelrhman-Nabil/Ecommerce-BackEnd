const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const productSchema=new Schema({
    title:{ type:String ,require:true },
    price:{ type:String ,require:true },
    details:{ type:String ,require:true },
    image:[{type:String ,require:true}],
    categories:{ type:String ,require:true },
    color:{ type:String ,require:true },
    storage:{ type:String ,require:true },
    creator:{type:mongoose.Types.ObjectId ,require:true, ref:'User'},
    reviewsId:[{type:mongoose.Types.ObjectId ,require:true, ref:'Review'}],

}); 
module.exports=mongoose.model('Product',productSchema)