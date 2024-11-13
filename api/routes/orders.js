const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');

router.get('/' , (req, res, next) => {
   Order.find()
   .select('_id quantity product')

   .exec()
   .then(orders => {
      res.status(200).json(orders);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.post('/' , (req, res, next) => {
 const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    quantity : req.body.quantity,
    product : req.body.productId
 });
 order
 .save()  //  The save method is already a promise, so you don't need to call .exec() on it.
 .then( result =>{
    console.log(result);
    res.status(201).json(result);
 })
 .catch(err =>{
    console.log(err);
    res.status(500).json({
        error: err
    });
 });

});

router.get('/:orderId' , (req, res, next) => { // : is used to set dynamic routes

    res.status(200).json({
        message: 'orders was fetched by id',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId' , (req, res, next) => {
    res.status(200).json({
        message: 'order deleted successfully',
        orderId: req.params.orderId
    });
});

module.exports = router;
