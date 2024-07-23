const mongoose = require ("mongoose")

const userSchema = new mongoose.Schema({
fullname:{type:String,
required:true,
trim:true,
lowercase:true
},

email:{type:String,
required:true,
trim:true,
lowercase:true,
unique:true
},

cohort:{type:String,
default:"Cohort 5IVE"
},

images:[{type:String}],

stack:{type:String,
required:true,
trim:true,
lowercase:true,
enum: ["frontend", "backend", "product design"]
},

isVerified:{type:String,
default:false,
},

qualification:{type:String,
required:true,
trim:true,
lowercase:true,
},

password:{type:String,
required:true,
}

},{timestamps:true})

const userModel = mongoose.model("Cohort 5IVE", userSchema)

module.exports = userModel