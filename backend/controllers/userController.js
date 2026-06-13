const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const registerUser = async (req, res) => {

  try {

    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      ),
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

};

const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {

      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        ),
      });

    } else {

      res.status(401).json({
        message: "Invalid email or password",
      });

    }

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  registerUser,
  loginUser,
};