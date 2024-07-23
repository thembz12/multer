const dotenv = require("dotenv").config()
const mongoose = require ("mongoose")
const URL = process.env.database

mongoose.connect(URL).then(()=>{
    console.log("database is now connected succesfully");
}).catch((error)=>{
    console.log(`database is not connected because`, error);
})