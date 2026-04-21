const db = require("../db");

const createReservation = (req, res) => {
    const { restaurant_id, reservation_date, guests } = req.body;
    const user_id = req.user.id;

    if (!restaurant_id || !reservation_date || !guests) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const query = `
        INSERT INTO reservations (user_id, restaurant_id, reservation_date, guests)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [user_id, restaurant_id, reservation_date, guests], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json({
            message: "Reservation created successfully"
        });
    });
};

const getMyReservations = (req, res) => {
    const user_id = req.user.id;

    const query = `
        SELECT reservations.*, restaurants.name AS restaurant_name
        FROM reservations
        JOIN restaurants ON reservations.restaurant_id = restaurants.id
        WHERE reservations.user_id = ?
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(results);
    });
};

const deleteReservation = (req, res) => {
    const reservation_id = req.params.id;
    const user_id = req.user.id;

    const query = `
        DELETE FROM reservations
        WHERE id = ? AND user_id = ?
    `;

    db.query(query, [reservation_id, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Reservation not found or not yours"
            });
        }

        res.json({
            message: "Reservation deleted successfully"
        });
    });
};

const updateReservation = (req, res) => {
    const reservation_id = req.params.id;
    const user_id = req.user.id;

    const { reservation_date, guests } = req.body;

    if (!reservation_date || !guests) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const query = `
        UPDATE reservations
        SET reservation_date = ?, guests = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(query, [reservation_date, guests, reservation_id, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Reservation not found or not yours"
            });
        }

        res.json({
            message: "Reservation updated successfully"
        });
    });
};

module.exports = {
    createReservation,
    getMyReservations,
    deleteReservation,
    updateReservation
};