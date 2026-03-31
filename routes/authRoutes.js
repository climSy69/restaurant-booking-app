const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Access granted",
        user: req.user
    });
});

module.exports = router;