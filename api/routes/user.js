const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require ('../models/user.js');

router.post('/signup', (req , res, next) => {

    // if (!req.body.email || !req.body.password) {
    //     return res.status(400).json({
    //         message: 'Email and password are required'
    //     });
    // }
    User.find({ email: req.body.email})
    .exec()
    .then(user =>{
        console.log(user);
        if(user){
            return res.status(409).json({
                message: 'Email already exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10 , (err , hash) =>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result =>{
                        console.log(result);
                        res.status(201).json({
                            message : 'User created successfully'
                        });
                    })
                    .catch(err=> {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    })
                }
            } )
        }
        
    })

    

})

module.exports = router;