const express = require("express");
const router = express.Router();

const { getMyReservations, deleteReservation } = require("../controllers/reservationController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/reservations", verifyToken, getMyReservations);
router.delete("/reservations/:id", verifyToken, deleteReservation);

module.exports = router;
