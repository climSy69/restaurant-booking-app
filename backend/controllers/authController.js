const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

// REGISTER
const registerUser = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const checkQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            res.json({
                message: "User registered successfully!"
            });
        });
    }); // 👈 αυτό έλειπε
}; // 👈 και αυτό έλειπε

// LOGIN
const loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            "mysecretkey",
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
};

module.exports = {
    registerUser,
    loginUser
};