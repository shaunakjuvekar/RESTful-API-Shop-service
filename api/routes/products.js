const express = require("express")
const mongoose = require("mongoose")
var multer  = require('multer')
const checkAuth = require("../middleware/check-auth");
const productControllers = require("../controllers/c-products");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './my-uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
  })
   
var upload = multer({ storage: storage })

const router = express.Router()

const Product = require("../models/product");

router.get("/",productControllers.get_all_products);

router.post("/",checkAuth, upload.single('productImg'),productControllers.create_product);

router.get("/:productID",(req,res,next)=>{
    let id = req.params.productID;
    Product.findById(id,(err,doc)=>{
        if (doc){
            const response = {
                name: doc.name,
                price: doc.price,
                id: doc._id,
            }
            res.status(200).json(response)
        }
        else {
            res.status(500).json({
            message: "Did not find product",    
            error: err
            })}
    })
})

router.patch("/:productId",checkAuth, productControllers.update_product);
  

router.delete("/:productId", checkAuth,productControllers.delete_product);
  

module.exports = router