import jwt from 'jsonwebtoken';
import User from '../model/user.js';

const authenticate= async (req,res,next)=>{
    try{
        const token=req.cookies.jwtoken;
        const verifyToken= jwt.verify(token,process.env.TOKEN_KEY);
        const user= await User.findOne({_id:verifyToken._id,"tokens.token":token});

        if(!user) {throw new Error('User not found')};

        req.token=token;
        req.rootUser=user;
        req.userId=user._id;
        next();
    }catch(err){
        res.send("unathorized").status(401)
    }
}

export default authenticate;