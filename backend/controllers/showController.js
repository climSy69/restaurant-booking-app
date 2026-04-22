const db = require("../db");

const getShows = (req, res) => {
    const { theatreId, title } = req.query;

    let query = `
        SELECT shows.*, theatres.name AS theatre_name
        FROM shows
        JOIN theatres ON shows.theatre_id = theatres.theatre_id
    `;

    const conditions = [];
    const values = [];

    if (theatreId) {
        conditions.push("shows.theatre_id = ?");
        values.push(theatreId);
    }

    if (title) {
        conditions.push("shows.title LIKE ?");
        values.push(`%${title}%`);
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
    getShows
};
