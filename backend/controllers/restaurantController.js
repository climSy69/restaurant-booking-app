const db = require("../db");

const getRestaurants = (req, res) => {
    const query = "SELECT * FROM restaurants";

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
};

module.exports = {
    getRestaurants
};