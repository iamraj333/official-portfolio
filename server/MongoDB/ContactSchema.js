const mongoose=require('mongoose')

const contactStructure=mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    subject:{type:String, required:true},
    message:{type:String, required:true},
},{timestamps:true})

//creating model
const ContactSchema=new mongoose.model("Contact", contactStructure)

module.exports=ContactSchema;