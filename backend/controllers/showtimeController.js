const db = require("../db");

const getShowtimes = (req, res) => {
    const { showId, date } = req.query;

    let query = "SELECT * FROM showtimes";
    const conditions = [];
    const values = [];

    if (showId) {
        conditions.push("show_id = ?");
        values.push(showId);
    }

    if (date) {
        conditions.push("show_date = ?");
        values.push(date);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    db.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
};

module.exports = {
    getShowtimes
};
