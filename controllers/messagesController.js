const Chat = require("../models/Chat");
const Message = require("../models/Message");

module.exports.createMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    if (!content || !chatId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data passed into request.",
      });
    }
    let newMessage = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    });
    const message = await Message.findById(newMessage._id)
      .populate("sender", "name email picture")
      .populate("chat")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: { name: 1, email: 1, picture: 1 },
        },
      });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    return res.status(200).json({
      success: true,
      data: message,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email picture")
      .populate("chat");
    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
