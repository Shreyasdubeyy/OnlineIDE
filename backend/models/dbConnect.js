// const mongo=require("mongoose")
// const url='mongodb+srv://shreyas:easycode@easycode.02oop2d.mongodb.net/?retryWrites=true&w=majority'


//     const connectDb=async()=>{
//         await mongo.connect(url);
//     console.log("Connected to database successfully")
//     }
    


// module.exports=connectDb()
require('dotenv').config();

const mongoose = require("mongoose");
const url = process.env.MONGO_URI

// Create an async function to connect
const connectDb = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

// Export the function itself, don't call it here
module.exports = connectDb;
