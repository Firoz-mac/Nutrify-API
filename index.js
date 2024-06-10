const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//for handling cors
const cors=require('cors');




//importing usermodel from model folder
const userModel = require('./models/userModel')


//importing foodmodel from model folder
const foodModel= require('./models/foodModel')

//importing trackingmodel from model folder
const trackingModel=require('./models/trackingModel')

//importing verifytoken function file
const verifyToken=require('./vrifyToken')





//data base connection

mongoose.connect('mongodb://localhost:27017/nutrify')
    .then(() => {
        console.log('data base connection successfull')
    })
    .catch((err) => {
        console.log(err)
    })




//creating server

const app = express();
app.use(express.json()); //for auto converting json data
app.use(cors()); //for handling cors

app.listen(8000, () => {
    console.log('Server is up and Running')
})


//end point for register new user

app.post('/register', userNameAndEmailCheck, async (req, res) => {




    let userInfo = req.body;
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {

        if (!err) {

            bcrypt.hash(userInfo.password, salt, async (err, hashedPassword) => {


                if (!err) {
                    userInfo.password = hashedPassword;
                    try {

                        let doc = await userModel.create(userInfo)
                        res.status(201).send({ message: 'Account Created Successfully' })
                    }
                    catch (err) {

                        console.log(err)
                        res.status(500).send({ message: 'Something went wrong while registering, try again' })

                    }

                }
                else {
                    console.log(err)
                    res.status(500).send({ message: 'Some Problem, try again' })
                }
            })
        }
        else {
            console.log(err)
            res.status(500).send({ message: 'Some Problem, try again' })
        }

    })




})



//middleware to check the username or email is already exicsted or not while registering

async function userNameAndEmailCheck(req, res, next) {

    try {

        let info = await userModel.findOne({ name: req.body.name })

        if (info == null) {

            try {

                let info2 = await userModel.findOne({ email: req.body.email })

                if (info2 == null) {

                    next()
                }
                else {

                    console.log('Email Id Already Registerd')
                    res.send({ message: 'Email Id Already Registerd' })

                }


            }
            catch (err) {

                console.log(err)
                res.status(500).send({ message: 'Some Problem, try again' })

            }


        }
        else {

            console.log('user name already taken')
            res.send({ message: 'User Name Already Taken' })
        }
    }
    catch (err) {

        console.log(err)
        res.status(500).send({ message: 'Some Problem, try again' })


    }

}



//end point for login

app.post('/login',async (req,res)=>{

    let logingInfo=req.body


    try{

        const info= await userModel.findOne({email:logingInfo.email})

        if(info!==null){

            bcrypt.compare(logingInfo.password,info.password,(err,result)=>{

                if (result==true) {

                    //creating a token while user is logging


                    jwt.sign({email:logingInfo.email},"nutrifyapp",(err,token)=>{

                        if(!err){
                            res.send({message:'Login successfull',token:token,name:info.name,userId:info._id})
                        }
                        else
                        {
                            console.log(err)
                            res.send({message:'Some Problem, try again'})
                        }
                    })
                    
                }
                else{

                    console.log(err)
                    res.status(403).send({message:'Incorrect Password'})

                }
            })

        }
        else
        {

            res.status(404).send({message:'User Not Found'})

        }

    }
    catch(err){

        console.log(err)
        res.status(500).send({message:'Some Problem, try again'})

    }

    
})



//end point for see all food

app.get('/foods',verifyToken,async(req,res)=>{
    
    try{
        const data= await foodModel.find()
        res.send(data)
    }
    catch(err){
        console.log(err)
        res.send({message:'cant find data'})
    }
})

//end point for search food by name

app.get('/foods/:name',verifyToken,async(req,res)=>{

    try{

        let food= await foodModel.find({name:{$regex:req.params.name,$options:'i'}})
        
        if(food.length!==0){

            res.send(food)

        }
        else
        {

            res.status(404).send({message:'Food Item Not Found'})

        }

    }
    catch(err){
        console.log(err)
        res.status(500).send({message:'Some Problem Getting The Food'})
    }
})



//end point for track a food

app.post('/track',verifyToken,async (req,res)=>{

    let trackData= req.body
    console.log(trackData)

    try{

        let data= await trackingModel.create(trackData);
        res.status(201).send({message:'Food Added'})
    }
    catch(err){
        console.log(err)
        res.status(500).send({message:'Some Problem in adding Food'})
    }
})



//end point for fatch all foods eaten by a user

app.get('/track/:userid/:date',verifyToken,async (req,res)=>{

    let userId=req.params.userid;
    let userDate=new Date(req.params.date);
    let strDate= (userDate.getMonth()+1)+"/"+userDate.getDate()+"/"+userDate.getFullYear();

    try{

        let foods= await trackingModel.find({userId:userId,eatenDate:strDate}).populate('userId').populate('foodId')
        res.send(foods);

    }
    catch(err){
        console.log(err)
        res.status(500).send({message:'Some Problem in Getting the Food'})
    }


})
