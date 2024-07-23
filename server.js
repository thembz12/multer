const express = require ("express")
require("./Config/DBconfig")
const port = process.env.port || 1212
const app = express()
app.use(express.json())
const router = require ("./userRouter/userRouter")
app.use('/uploads', express.static('uploads'))
app.use("/api/v1/users", router)
app.listen(port,()=>{
    console.log(`server is listening to`,port);
})

app.get("/", ()=>{
    resizeBy.status(200).json({
        message:"HELLO UNCLE THEMBZ"
    })
})