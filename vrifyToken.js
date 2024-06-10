//middleware for checking token
const jwt = require('jsonwebtoken');

async function verifyToken(req,res,next){

    if(req.headers.authorization!==undefined){

        
        let token=(req.headers.authorization.split(' ')[1]);

        jwt.verify(token,"nutrifyapp",(err,data)=>{
            if(!err){

                next();
            }
            else{
                res.status(403).send({message:'invalid token please login again'})
            }
        })

    }
    else
    {

        res.send({message:'Please Send Token'})

    }


}

module.exports=verifyToken;
