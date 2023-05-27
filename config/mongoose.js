const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${db.connection.host}`.cyan.underline);
  } catch (err) {
    console.error.bind(console, `Error in connecting to DB: ${err}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;

// mongoose.connect(process.env.MONGO_URI);

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "Error in DB"));

// db.once("open", () => {
//   console.log("Database connection successful.");
// });
