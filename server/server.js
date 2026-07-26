
const express=require('express')
const myapp=express()
const UserRouter=require('./RouterController/UserRouter')
const cors=require('cors')
const env=require('dotenv')
require('dotenv').config()

const corsExtra={
    origin:process.env.CLIENT_URL,
    methods:'GET, POST, PUT, DELETE, PATCH, HEAD',
    credentials:true
}

/*========== MIDDELWARE ============================*/
myapp.use(cors(corsExtra))
myapp.use(express.json({
    limit: "10mb"
}));

myapp.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

myapp.use("/", UserRouter)




//Error Handing
myapp.use((err, req,res,next)=>{
    res.status(500).json({message:"Server is not responding"})
})

//mongoose Connection
const PORT=process.env.PORTNUM || 3000;
const MongooseConnection=require('./MongoDB/MongooseConnection')
MongooseConnection().then(()=>{
    myapp.listen(PORT,()=>{

        console.log(`Server is running on ${PORT}`)
    })
}
)
.catch(e=>{
    console.error("Failed in Server Building")
})
