const jwt = require("jsonwebtoken");
const { User, Tasks } = require("../db_models/userAndTask");
const mongoose = require("mongoose");

module.exports.auth = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    if (token.substring(0, 6) != "Bearer") {
      res.status(400).json({ message: "Invalid Bearer token." });
    }
    token = token.substring(7);
    const user = {
      userId: 123,
      username: "Hardik123",
    };
    const token1 = jwt.sign(user, process.env.JWT_SECRET);
    console.log(token1);
    const decoded = jwt.verify(token1, process.env.JWT_SECRET);

    const { userId } = decoded;

    try {
      const user = await User.findOne({ userId });

      if (!user) {
        const newUser = new User({
          userId,
          username: decoded.username,
        });
        await newUser.save();
        console.log("User created:", newUser);

        req.user = newUser;
        next();
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid token." });
  }
};
