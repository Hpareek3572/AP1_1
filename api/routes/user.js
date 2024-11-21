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
    console.log(req.body.email, req.body.password)
    User.find({ email: req.body.email})
    .exec()
    .then(user =>{
        console.log(user + "#############",user);
        if(user?.length > 0){
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
                    user
                    .save()
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
// router.post("/signup", (req, res, next) => {
//     bcrypt.hash(req.body.password ,  10 , (err, hash)=>{
//         if(err){
//             return res.status(500).json({
//                 error: err
//             });
//         }
//         else{
//             const user = new User({
//                 _id: new mongoose.Types.ObjectId(),
//                 email: req.body.email,
//                 password: hash
//             });

//             user
//             .save()
//            .then(result => {
//                 res.status(201).json({
//                     message : 'User created successfully'
//                 });
//             })
//            .catch(err => {
//             console.log(err);
//                 res.status(500).json({
//                     error: err
//                 });
//             });
//         }
//     })
// })










router.delete('/:userId', ( req , res , next )=>{
    User.findByIdAndDelete(req.params.userId)
   .exec()
   .then(result => {
    res.status(200).json({
        message : 'User deleted successfully'
    })
   })
   .catch(err => {
    res.status(500).json({
        error: err
    })
   })
})

module.exports = router;






// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const User = require('../models/user.js');

// router.post('/signup', (req, res, next) => {
//     // Check if email and password are provided
//     if (!req.body.email || !req.body.password) {
//         return res.status(400).json({
//             message: 'Email and password are required'
//         });
//     }

//     // Validate Email format (basic email validation regex)
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(req.body.email)) {
//         return res.status(400).json({
//             message: 'Invalid email format'
//         });
//     }

//     // Check if the email already exists
//     User.findOne({ email: req.body.email })
//         .exec()
//         .then(user => {
//             if (user) {
//                 // If user already exists
//                 return res.status(409).json({
//                     message: 'Email already exists'
//                 });
//             } else {
//                 // Hash the password and create a new user
//                 bcrypt.hash(req.body.password, 10, (err, hash) => {
//                     if (err) {
//                         return res.status(500).json({
//                             error: err
//                         });
//                     } else {
//                         // Create the new user document
//                         const newUser = new User({
//                             _id: new mongoose.Types.ObjectId(),
//                             email: req.body.email,
//                             password: hash
//                         });

//                         // Save the user to the database
//                         newUser
//                             .save()
//                             .then(result => {
//                                 res.status(201).json({
//                                     message: 'User created successfully'
//                                 });
//                             })
//                             .catch(err => {
//                                 res.status(500).json({
//                                     error: err
//                                 });
//                             });
//                     }
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

// // Delete user by ID (admin or user)
// router.delete('/:userId', (req, res, next) => {
//     User.findByIdAndDelete(req.params.userId)
//         .exec()
//         .then(result => {
//             if (result) {
//                 res.status(200).json({
//                     message: 'User deleted successfully'
//                 });
//             } else {
//                 res.status(404).json({
//                     message: 'User not found'
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

// module.exports = router;



