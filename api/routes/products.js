const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const { json } = require('body-parser');


// doubt - if we want to access only our last entry without id then how can we do that
router.get('/',  (req, res , next)=> {
   
   /* The code snippet `Product.find().exec().then(docs => { console.log(docs);
   res.status(200).json(docs); })` is a route handler for a GET request to retrieve all products
   from the database. Here's a breakdown of what it does: */

    Product.find() 
    // we will fetch these things only

    .select('name price _id')

    /* The `Product.find()` method is used to retrieve all documents from the Product model.
    The `.exec()` method is then used to execute the query and return a promise. *
    /* In the provided code snippet, the `.exec()` method is used in conjunction with Mongoose queries
    to execute the query and return a promise. It is a way to execute the query asynchronously and
    handle the results using promises. */

    .exec()

   /* The code snippet `.then(docs => { console.log(docs); res.status(200).json(docs); })` is a part of
   a route handler for a GET request to retrieve all products from the database. Here's a breakdown
   of what it does: */
    .then(docs =>{
       const response = {
        count : docs.length,
        products: docs
       }
        res.status(200).json(response);
    })

   /* The `.catch` block in the code snippet you provided is used to handle errors that may occur
   during the execution of the asynchronous operation. In this case, it is specifically handling
   errors that may occur when querying the database or saving data. */
    .catch (err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
})

router.post('/',  (req, res , next)=> {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        price: req.body.price
    }) // we use Product as a constructor through this constructor we pass js object
  
    product.save().then(result =>{
        console.log(result);
        res.status(201).json({
            message: 'Handeling POST request to / products',
            createdProduct: result
        })
       })
       .catch(err =>{ 
        console.log(err)
    res.status(500).json({
        error: err
    });});
})

router.get('/:productId', (req, res, next)=> {
   /* This code snippet is a route handler for a GET request to retrieve a specific product by its ID.
   Here's a breakdown of what it does: */
    const id = req.params.productId;
   Product.findById(id)
   .exec()
   .then(doc =>{
    console.log("From database",doc);
    res.status(200).json(doc);
   })
   /* The `.catch(err => { console.log(err); res.status(500).json({ error: err }); });` block in the
   code snippet you provided is used to handle errors that may occur during the execution of
   asynchronous operations, specifically when querying the database or saving data. */
   .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
    });
})

// router.patch('/:productId', (req, res, next)=> {
//     const id = req.params.productId;
//     const updateOps = {};
//     for(const ops of req.body){
//         updateOps[ops.propName] = ops.value;
//     }
//   Product.updateOne({_id:id}, {$Set : updateOps})
//   .exec() 
//   .then(result =>{
//     console.log(result);
//     res.status(200).json({
//         message: 'Product updated successfully',
//         result: result
//     });
//   })
//   .catch(err =>{
//     console.log(err);
//     res.status(500).json({
//         error: err
//     });
//   })
// })

router.delete('/:productId', (req, res, next)=> {
    const id = req.params.productId;
    Product.findByIdAndDelete(id)
    .exec()
    .then(result => {
        if (result) {
            // If a product was found and deleted
            res.status(200).json({
                message: 'Product deleted successfully',
                result: result
            });
        } else {
            // If no product was found with that id
            res.status(404).json({
                message: 'Product not found'
            });
        }
    })
   .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
    });
   })


module.exports = router;