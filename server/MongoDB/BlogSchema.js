const mongoose=require('mongoose')

const blogStructure=mongoose.Schema({
    title:{type:String, required:true, trim:true},
    excerpt: { type: String, required: true, trim: true},
    content:{type:String, required:true, trim:true},
    thumbnail:{type:String, required:true, default:'', trim:true},
    category:{type:String, required:true, default:"General", trim:true},
    tags:{type:[String], default:[],},
    comments:[{
        content:{type:String, required:true},
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        createdAt:{type:Date, default:Date.now}
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    views:{type:Number, default:0}
}, {timestamps:true})

//creating model
const BlogSchema=new mongoose.model("Blog", blogStructure);

module.exports=BlogSchema