const db = require("../db");

const getTheatres = (req, res) => {
    const query = "SELECT * FROM theatres";

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
};

module.exports = {
    getTheatres
};
