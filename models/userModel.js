const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    
    name:{
        type:String,
        required:[true,"Name is Mandatory"]
    },
    email:{
        type:String,
        required:[true,"Email is Mandatory"]
    },
    password:{
        type:String,
        required:[true,"Password is Mandatory"],
        minlength:8
    },
    age:{
        type:Number,
        required:[true,"Age is Mandatory"],
        min:12
    }
},{timestamps:true})

const userModel=mongoose.model('users',userSchema);

module.exports= userModel;