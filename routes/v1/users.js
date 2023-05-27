const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.get("/", authMiddleware.authenticate, usersController.searchUser);

module.exports = router;
