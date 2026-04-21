const express = require("express");
const router = express.Router();

const { createReservation, getMyReservations, deleteReservation, updateReservation } = require("../controllers/reservationController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createReservation);
router.get("/my", verifyToken, getMyReservations);
router.delete("/:id", verifyToken, deleteReservation);
router.put("/:id", verifyToken, updateReservation);

module.exports = router;