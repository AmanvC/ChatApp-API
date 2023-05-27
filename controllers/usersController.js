const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.signup = async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing input fields!",
      });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already in use!",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await User.create({
      name,
      email,
      password: hashedPassword,
      picture,
    });
    console.log("AFTER");
    return res.status(200).json({
      success: true,
      message: "User created successfully!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).lean();
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist, please signup to continue!",
      });
    }
    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password!",
      });
    }
    const { password, ...otherData } = user;
    const token = jwt.sign(otherData, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      message: "User created successfully!",
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

module.exports.searchUser = async (req, res) => {
  try {
    const query = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(query)
      .find({ _id: { $ne: req.user._id } })
      .select("-password");
    return res.send(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
