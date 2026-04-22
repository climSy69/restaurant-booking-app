const express = require("express");
const router = express.Router();

const { getShows } = require("../controllers/showController");

router.get("/", getShows);

module.exports = router;
