const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    deleteOrder,
} = require("../controllers/orderController");

router.post("/", createOrder);

router.get("/:id", getOrderById);

router.get("/user/:userId", getUserOrders);

router.patch("/:id", updateOrderStatus);

router.delete("/:id", deleteOrder);

module.exports = router;
