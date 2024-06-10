const mongoose=require('mongoose');

const foodSchema=mongoose.Schema({

    name:{
        type:String,
        required:[true,"Name is Mandatory"]
    },
    image:{
        type:String,
        required:[true,"image is Mandatory"]
    },
    calories:{
        type:Number,
        required:[true,"calories is Mandatory"]
    },
    protein:{
        type:Number,
        required:[true,"calories is Mandatory"]
    },
    carbohydrates:{
        type:Number,
        required:[true,"calories is Mandatory"]
    },
    fat:{
        type:Number,
        required:[true,"calories is Mandatory"]
    },
    fiber:{
        type:Number,
        required:[true,"calories is Mandatory"]
    }

},{timestamps:true})

const foodModel=mongoose.model('foods',foodSchema);

module.exports=foodModel;