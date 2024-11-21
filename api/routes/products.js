const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


// Multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null , new Date().toISOString() + file.originalname);
    }
});

const upload = multer({storage: storage})

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
        success: true,
        count : docs.length,
        products: docs.map(doc => {
            return {
                _id: doc._id,
                name: doc.name,
                price: doc.price,
                request: {
                    type: 'GET',
                    url: `http://${req.get('host')}/products/${doc._id}`
                }
            }
        })
       }
        res.status(200).json(response);
    })

   /* The `.catch` block in the code snippet you provided is used to handle errors that may occur
   during the execution of the asynchronous operation. In this case, it is specifically handling
   errors that may occur when querying the database or saving data. */
    .catch (err =>{
        console.log(err);
        res.status(500).json({
            success: false,
            error: {
                message: err.message || 'Internal server error',
                status: 500
            }
        });
    })
})

router.post('/', upload.single('productImage'),  (req, res , next)=> {
   
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        price: req.body.price
    }) // we use Product as a constructor through this constructor we pass js object
  
    product.save()
        .then(result =>{
            console.log(result);
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: 'GET',
                        url: `http://${req.get('host')}/products/${result._id}`
                    }
                }
            });
        })
        .catch(err =>{ 
            console.log(err);
            res.status(500).json({
                success: false,
                error: {
                    message: err.message || 'Failed to create product',
                    status: 500
                }
            });
        });
})

router.get('/:productId', (req, res, next)=> {
    const id = req.params.productId;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: 'Invalid product ID format'
        });
    }

    Product.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: `http://${req.get('host')}/products/${doc._id}`
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Internal server error',
                details: err.message
            });
        });
})

router.patch('/:productId', (req, res, next)=> {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
  Product.updateOne({_id:id}, {$set: updateOps})
  .exec() 
  .then(result =>{
    console.log(result);
    res.status(200).json({
        message: 'Product updated successfully',
        result: result
    });
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({
        error: err
    });
  })
})

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