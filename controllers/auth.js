const User = require("../models/user");
const Order = require("../models/order");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { hashPassword, comparePassword } = require("../helpers/auth");

//=============================================
//==================Register User================
//=============================================
exports.register = async (req, res) => {
  
  try {
    // 1.  destructuring name, email, password from body
    const { name, email, password } = req.body;
    // 2. all field require validation
    if (!name.trim()) {
      return res.json({ error: "Name is require" });
    }
    if (!email.trim()) {
      return res.json({ error: "Email is require" });
    }
    if (!password || password.length < 6) {
      return res.json({ error: "Password must be at least 6 character long" });
    }
    // check if email is taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.json({ error: "User is taken" });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    // register user
    const user = await new User({
      name,
      email,
      password: hashedPassword,
    }).save();
    // create token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 1000 * 86400),
      sameSite: "none",
      // secure: true,
    });

    // sending response
    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (e) {
    console.log(e);
  }
};

//=============================================
//==================Login User===========================
//=============================================

exports.loginUser = async (req, res) => {
  try {
    // 1.  destructuring email, password from body
    const { email, password } = req.body;

    // all field validation =
    if (!email) {
      res.json({ error: "Email required" });
    }
    if (!password || password.length < 6) {
      res.json({ error: "Password required" });
    }
    // check if email is taken
    const user = await User.findOne({ email });
    if (!user) {
      res.json({ error: "User not found" });
    }
    // compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({ error: "Wrong Password" });
    }
    // create sign jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // send response
    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (e) {
    console.log(e);
  }
};

// logout user

exports.logout = async (req, res) => {
  try {
    // Send HTTP-only cookie
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      // secure: true,
    });

    res.json({ Message: "LogOut successfully" });
  } catch (error) {
    return res.json(error.message);
  }
};

//=============================================
//==================  UpdateProfile  ===========================
//=============================================

exports.updateProfile = async (req, res) => {
  try {
    const { name, password, address } = req.body;
    const user = await User.findById(req.user._id);
    if (!password && password.length < 6) {
      return res.json({
        error: "Passowrd is required and should be more then 6 character",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;

    const update = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        address: address || user.address,
      },
      {
        new: true,
      }
    );

    update.password = undefined;
    res.json(update);
  } catch (error) {
    console.log(error);
  }
};


// USER ORDERS

exports.getOrderController = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name");
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error
    })
  }
}
