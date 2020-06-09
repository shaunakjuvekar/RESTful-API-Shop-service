const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
require('dotenv').config();
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req,res,next)=>{
    bcrypt.hash(req.body.password,10,(err,hashedP)=>{
        if (err){
            console.log("hash not success");         
            res.json(err)
        }
        else{
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hashedP
            })
            user
            .save()
            .then(result=>{
                console.log(result);
                
                res.status(201).json({
                    message: "User successfully created",
                    user: result
                })
            })
            .catch(error=>{
                console.log("There is an error with user creation");               
                res.status(500).json(error)
            })
        }
    })
}

exports.user_login = (req,res,next)=>{
    
    User.find({email: req.body.email},(err,user)=>{
        if (!err){  
            if (user.length>=1){
                bcrypt.compare(req.body.password,user[0].password,(error,match)=>{
                    if (error){
                        res.status(401).json({
                            error: error
                        })
                    }
                    else{
                        if (match){
                            const token = jwt.sign(
                                {
                                email: user[0].email,
                                userID: user[0]._id 
                                },
                                process.env.JWT_KEY,
                                {
                                    expiresIn: "1h"
                                }
                            )
                            res.status(200).json({                              
                                message:"Login successful",
                                token: token
                            })  
                        }
                        else{
                            res.status(401).json({
                                message:"Login failed, incorrect password"
                            })
                        }
                    }
                })
            }
            else{
                res.status(500).json({
                    message: "User doesnt exist"
                })
            }
        }
        else{
            res.status(500).json(err);
        }
    })
}

exports.user_delete = (req,res,next)=>{
    User.findByIdAndRemove(req.params.userId,(err,result)=>{
        if (err){
            res.status(500).json({
                message: "Error occurred while deleting",
                error: err
            })
        }
        else{
            if(!result){
                res.status(500).json({
                    message: "No such record exists"
                })
            } 
            res.status(200).json({
                message: "User Deletion success"
            })
        }
    })
}