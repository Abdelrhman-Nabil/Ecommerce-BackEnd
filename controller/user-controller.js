const HttpError = require("../modals/http-error");
const { validationResult } = require("express-validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const User = require("../modals/schema/users");
const Addmin=require("../modals/schema/addmin")

const getUserById=async(req,res,next) =>{
  const userId = req.params.uid;
  
  let user;
 try{
  user= await User.findById(userId);

 }catch (err) {
  const error = new HttpError(
    "Something went wrong ,couldn't find a user",
    500
  );
  return next(error);
}
if (!user) {
  const error = new HttpError(
    "Couldn't find a user for the previos user ID",
    404
  );
  return next(error);
}
res.json({ user: user.toObject({ getters: true }) });

}


const signUp = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed ,please check your data", 422)
    );
  }
  const { name, email, password,address} = req.body;
  let existingUser;
  try{
    existingUser=await User.findOne({ email: email })
  }catch(err){
 const error = new HttpError("SignUp FAILED ,please try again later", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "User exist already ,please login insted.",
      422
    );
    return next(error);
  }
  let hashPassword;
  try{
    hashPassword=await bcrypt.hash(password,12)
  }
  catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );

    return next(error);
  }
 
  const createdUser=new User({
    name,
    email,
    image:req.file.path,
    password:hashPassword,
    orders:[],
    address
  });
  try{
    await createdUser.save()
  }
  catch (err) {
    const error = new HttpError("Sign Up  failed, please try again.", 500);
    return next(error);
  }
  let token;
  try{
    token=jwt.sign({userId:createdUser.id ,email:createdUser.email},process.env.DB_USER,{expiresIn:"1h"})
  }
  catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }  
  res.status(201).json({userId: createdUser.id,address:createdUser.address,image:createdUser.image,email:createdUser.email,token:token});

};

const logIn = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed ,please check your data", 422)
    );
  }
  const { email, password } = req.body;

  let existingUser,existAddmin;
  try{
    existAddmin=await Addmin.findOne({email}) ||''
  }catch(err){}

  try{
    existingUser=await User.findOne({email})
  }catch(err){
    const error = new HttpError("sign In FAILED ,please try again later", 500);
    return next(error);
  }
  if(!existingUser){
    const error=new HttpError("Invalid credentials ,couldn't log in",400)
    return next(error)
  }
  let isValidPassword=false;
  try{ 
    isValidPassword=await bcrypt.compare(password,existingUser.password)
  }
   catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }
    if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }
    
  let token;
  try{
    token=jwt.sign({userId:existingUser.id ,email:existingUser.email},process.env.DB_USER,{expiresIn:"1h"})
  }
  catch (err) {
    const error = new HttpError(
      'loging in  failed, please try again later.',
      500
    );
    return next(error);
  }
  // res.json({userId: existingUser.id,email:existingUser.email,token:token,addmin:{existAddmin}?true:false})  
 
    const exist=existAddmin?true:false

    res.json({userId: existingUser.id,email:existingUser.email,token:token,addmin:exist})  
};
exports.getUserById=getUserById;
exports.signUp = signUp;
exports.logIn = logIn;
