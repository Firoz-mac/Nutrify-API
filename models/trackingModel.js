const mongoose=require('mongoose');

const trackingSchema=mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:[true,'Userid is mandatory']
    },
    foodId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'foods',
        required:[true,'Foodid is mandatory']
    },
    details:{
        type:Object,
        required:[true,'details is mandatory']

    },
    eatenDate:{
        type:String,
        default:new Date().toLocaleDateString()
    },
    quantity:{
        type:Number,
        min:1,
        required:[true,'Quantity is mandatory']
    }
},{timestamps:true})


const trackingModel=mongoose.model('trackings',trackingSchema)

module.exports=trackingModel;
