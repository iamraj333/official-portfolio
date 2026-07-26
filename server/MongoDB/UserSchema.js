const { default: mongoose } = require("mongoose");

const UserSchema=mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true}
},{timestamps:true})

const WebUser=new mongoose.model("User",UserSchema)

module.exports=WebUser;