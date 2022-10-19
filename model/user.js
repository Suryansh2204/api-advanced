import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    work:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    messages:[{
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true
        },
        message:{
            type:String,
            required:true
        }
    }]
});

userSchema.methods.generateAuthToken= async function(){
    try{
        const genToken= jwt.sign({_id:this._id},process.env.TOKEN_KEY);
        this.tokens=this.tokens.concat({token:genToken});
        await this.save();
        return genToken;
    }catch(err){
        console.log(err);
    }
};

userSchema.methods.addMessage= async function(name, email, phone, message){
    try{
        this.messages=this.messages.concat({name, email, phone, message});
        await this.save();
        return this.messages;
    }catch(err){
        console.log(err);
    }
};

export default mongoose.model("users",userSchema);