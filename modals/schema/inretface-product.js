const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const interfaceProductSchema=new Schema({
    id:{ type:String ,require:true },
    // price:{ type:String ,require:true },
    // details:{ type:String ,require:true },
    // image:[{type:String ,require:true}],
    // categories:{ type:String ,require:true },
    // color:{ type:String ,require:true },
    // storage:{ type:String ,require:true },

}); 
module.exports=mongoose.model('InterfaceProduct',interfaceProductSchema)