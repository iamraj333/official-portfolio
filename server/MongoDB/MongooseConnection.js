const mongoose=require('mongoose')
require('dotenv').config()

const MongooseConnection=async()=>{
    try{
        const connect=await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log("Mongoose Connection successful")
    }
    catch(e){
        console.error("MongoDB connection has been failed")
    }
}

module.exports=MongooseConnection