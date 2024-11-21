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
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    
    // Handle preflight requests
    if(req.method === 'OPTIONS'){ 
        return res.status(200).json({
            success: true,
            message: 'Preflight request successful'
        });
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

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || 'Internal Server Error';
    
    // Log error for debugging
    console.error(`[Error] ${status}: ${message}`);
    if (error.stack) console.error(error.stack);
    
    res.status(status).json({
        error: {
            status: status,
            message: message,
            path: req.path,
            timestamp: new Date().toISOString()
        }
    });
});



module.exports = app;