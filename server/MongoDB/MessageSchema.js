const mongoose=require('mongoose');

const MessageStructure=mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    message:{type:String, required:true}
}, {timestamps:true})

const MessageSchema=new mongoose.model('Message', MessageStructure);

module.exports=MessageSchema;