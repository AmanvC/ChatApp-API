const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const messagesController = require("../../controllers/messagesController");

router.post("/", authMiddleware.authenticate, messagesController.createMessage);
router.get(
  "/:chatId",
  authMiddleware.authenticate,
  messagesController.getAllMessages
);

module.exports = router;
