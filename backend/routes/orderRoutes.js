const express = require("express");
const {
  getAllOrders,
  createNewOrder,
  markOrderAsCompleted,
  markOrderAsPaid,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();
const checkIfStaffOrAdmin = require("../middlewares/checkIfStaffOrAdmin");

router.get("/", checkIfStaffOrAdmin, getAllOrders);
router.put("/:id/mark", checkIfStaffOrAdmin, markOrderAsCompleted);
router.post("/:id/mark-as-paid", markOrderAsPaid);
router.post("/", createNewOrder);
router.delete("/:id", checkIfStaffOrAdmin, deleteOrder);

module.exports = router;
