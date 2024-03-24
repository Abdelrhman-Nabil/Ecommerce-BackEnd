const fs=require('fs')
const express=require('express')
const path = require('path');
const bodyParser=require("body-parser")
const mongoose=require("mongoose")

const HttpError=require('./modals/http-error')
const productRoute=require('./routes/product-route')
const UserRoute=require('./routes/user-route')
const AddminRoute=require('./routes/adminRoute')
const orderRouter=require('./routes/order-Route')
const ReviewRouter=require("./routes/review-route")
const interfaceProductRouter=require("./routes/Interface-product-router")
const stripe=require("./routes/stripe")
const app=express();

app.use(bodyParser.json())
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type ,Accept ,Authorization');
    res.setHeader('Access-Control-Allow-Methods',' GET, POST, PATCH, DELETE')

    next();
});
app.use('/api/product',productRoute);
app.use('/api/interfaceProduct',interfaceProductRouter);
app.use('/api/users', UserRoute); // => /api/places...
app.use('/api/addAdmin',AddminRoute);
app.use('/api/orders',orderRouter)
app.use('/api/reviews',ReviewRouter)
app.use('/api/Stripe',stripe)

app.use((req,res,next)=>{
    const error=new HttpError("couldn't find this route",404);
    throw error 
})
app.use((error,req,res,next)=>{
    if(req.file){
        fs.unlink(req.file.path,err=>{console.log(err)})
      }
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message:error.message || 'An unkown error eccurred'})
})
const url=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.onfdltd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(url)
.then(()=>{
    app.listen(5000);
    console.log("contect to database")
})
.catch(err=>{
    console.log(err)
})
