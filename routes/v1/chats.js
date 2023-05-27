const express = require("express");
const router = express.Router();
const chatsController = require("../../controllers/chatsController");
const { authenticate } = require("../../middlewares/authMiddleware");

router.post("/create", authenticate, chatsController.createOrGet);
router.get("/get-all", authenticate, chatsController.getAllChats);
router.post("/create-group", authenticate, chatsController.createGroup);
router.patch("/rename-group", authenticate, chatsController.renameGroup);
router.patch("/remove-user", authenticate, chatsController.removeGroupUser);
router.patch("/add-user", authenticate, chatsController.addUserToGroup);

module.exports = router;
