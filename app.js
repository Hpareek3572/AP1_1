const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://harshpareek23:' + process.env.MONGO_ATLAS_PW + '@cluster0.3zqzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

    // mongoose.Promise = global.Promise;

const productRoutes = require('./api/routes/products.js');
const OrderRoutes = require('./api/routes/orders.js');
const userRoutes = require('./api/routes/user.js');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// we use this code  to avoid cors errors from here 
// cors errors are the security mechanism by brosewr enforsed by the prowser
app.use((req, res, next) => {
   /* `res.header('Access-Control-Allow-Origin', '*');` is setting the response header for
   Access-Control-Allow-Origin in the HTTP response. This header is used to specify which origins
   are allowed to access the resources of a server. */
    res.header('Access-Control-Allow-Origin', '*'); // this alllow our api acces by other ports als
   
    res.header(
        'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        if(req.method === 'OPTIONS'){ // this tell browser what to send like put , post etc 
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            return res.status(200).json({})
        }
        next();
})

// till here we are managing cors errors


app.use('/products', productRoutes);
app.use('/orders', OrderRoutes);
app.use("/user", userRoutes);

/* This code snippet is setting up error handling middleware in a Node.js Express application. */
app.use((req, res , next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error , req, res , next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})



module.exports = app;