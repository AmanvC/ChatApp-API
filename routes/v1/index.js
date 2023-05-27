const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/users", require("./users"));
router.use("/chats", require("./chats"));
router.use("/messages", require("./messages"));

module.exports = router;
