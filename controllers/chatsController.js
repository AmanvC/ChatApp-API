const Chat = require("../models/Chat");

module.exports.createOrGet = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("USER ID", userId);
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing!",
      });
    }

    const currentChat = await Chat.find({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("latestMessage.sender", "-password");
    console.log("Chat exists?", currentChat);
    if (currentChat.length > 0) {
      return res.status(200).json({
        success: true,
        data: currentChat,
      });
    } else {
      const newChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      const fullChat = await Chat.findById(newChat.id).populate(
        "users",
        "-password"
      );
      return res.status(200).json({
        success: true,
        data: fullChat,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.getAllChats = async (req, res) => {
  try {
    const allChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmins", "-password")
      .populate("latestMessage")
      .populate("latestMessage.sender", "-password")
      .sort("-createdAt")
      .sort({ updatedAt: 1 });
    return res.status(200).json({
      success: true,
      data: allChats,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.createGroup = async (req, res) => {
  try {
    const { chatName, users } = req.body;
    console.log(req.body);
    if (!chatName || !users) {
      return res.status(401).json({
        success: false,
        message: "Group name, and group users are required!",
      });
    }
    if (users.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Atleast 2 users must be selected to create a group!",
      });
    }
    const newGroup = await Chat.create({
      chatName,
      isGroupChat: true,
      users: [...users, req.user._id],
      groupAdmins: [req.user._id],
    });
    const groupChatDetails = await Chat.findById(newGroup._id)
      .populate("users", "-password")
      .populate("groupAdmins", "-password");

    return res.status(200).json({
      success: true,
      message: "Group chat created successfully.",
      data: groupChatDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmins", "-password");
    return res.status(200).json({
      success: true,
      message: "Group name updated successfully!",
      data: updatedChat,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.removeGroupUser = async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmins", "-password")
      .populate("latestMessage")
      .populate("latestMessage.sender", "-password");
    if (!updatedChat) {
      return res.status(400).json({
        success: false,
        message: "Group does not exist",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User removed from the group.",
      data: updatedChat,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

module.exports.addUserToGroup = async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmins", "-password")
      .populate("latestMessage")
      .populate("latestMessage.sender", "-password");
    if (!updatedChat) {
      return res.status(400).json({
        success: false,
        message: "Group does not exist",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User added to the group.",
      data: updatedChat,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
