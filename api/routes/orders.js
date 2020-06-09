const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const checkAuth = require("../middleware/check-auth");

const Order = require("../models/order");
const Product = require("../models/product");

const ordersController = require("../controllers/c-orders");

// Handle incoming GET requests to /orders
router.get("/",checkAuth,ordersController.orders_get_all);

router.post("/", checkAuth,ordersController.create_order);

router.get("/:orderId", checkAuth,ordersController.get_order);

router.delete("/:orderId",checkAuth,ordersController.delete_order);


module.exports = router