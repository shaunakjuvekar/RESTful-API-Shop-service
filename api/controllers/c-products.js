const mongoose = require("mongoose")
const Product = require("../models/product");

exports.get_all_products = (req,res,next)=>{
    Product.find()
    .select('name price _id productImg')
    .exec()
    .then(docs=>{
        const response = {
            count: docs.length,
            products: docs.map(doc=>{
                return {
                    name: doc.name,
                    price: doc.price,
                    id: doc._id,
                    productImg: doc.productImg,
                    request: {
                        type: 'GET',
                        url: "http://localhost:4000/products/" + doc._id
                    } 
                }
            })
        }
        res.status(200).json(response);
    })   
}

exports.create_product = (req,res,next)=>{
  
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
        //productImg: req.file.path
    })
    product.save()
    .then(result=> {
        console.log(req.userData)
        res.status(201).json({
            message: "Handled POST request for Products",
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:4000/products/" + result._id
                } 
            }
        })
    }
    ).catch(err=>{console.log(err);}
    )
}

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:4000/products/' + id
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }

  exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'DELETE',
                url: 'http://localhost:4000/products',
                body: { name: 'String', price: 'Number' }
            }
        });
      })
      .catch(err => {
        console.log(err); 
        res.status(500).json({
          error: err
        });
      });
  }
