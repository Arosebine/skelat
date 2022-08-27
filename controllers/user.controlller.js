const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../mail/email-sender");

exports.userSignup = async (req, res) => {
  const { bank_account, first_name, last_name, phone_number, password, email } =
    req.body;
  try {
    //  hash password
    const bankAcct = Math.floor(Math.random() * 10000000000);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      bank_account: bankAcct,
      first_name,
      last_name,
      phone_number,
      email,
      password: hashedPassword,
    });
    await sendEmail({
      email: user.email,
      subject: `${user.first_name} ${user.last_name} Registered Successfully`,
      message: `<div>
          <h1>HELLO ${user.first_name}</h1>
          <h2>You just registered successfully</h2>
          <p> We really appreciate your effort to registered on our platform. Skelat Bank is a premium bank where possibility is taking place</p>
          <p> Therefore, You are welcome onboard, pls, do enjoy our platform</p>
      </div>`,
    });

    return res
      .status(201)
      .json({ message: "You have been created successfully", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message, message: "internal server error" });
  }
};

exports.userLogin = async (req, res) => {
  const { password, phone_number } = req.body;

  try {
    // validation
    if (!(password && phone_number)) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // check if user exist in database
    const checkUser = await User.findOne({ phone_number: phone_number });

    // if user doesn't exist throw error
    if (!checkUser) {
      return res.status(404).json({ message: "user not found" });
    }

    // if user exist in database, check if user password is correct
    const checkPassword = await bcrypt.compare(password, checkUser.password);

    // if user password is not correct throw error ==> invalid credentials
    if (!checkPassword) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    // if user password is correct tokenize the payload
    const payload = {
      _id: checkUser._id,
    };

    const token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "2d",
    });

    // store token in cookie ====> web browser local storage
    res.cookie("access-token", token);
    return res
      .status(202)
      .json({ message: "You have login in successfully", token: token, checkUser });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message, message: "internal server error" });
  }
};


exports.getUserByPhoneNumber = async (req, res) => {
  try {
    const phone_number = req.params.phone_number;
    const user = await User.find({ phone_number: phone_number }).populate("phone_number");
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message, message: "internal server error" });
  }
};


exports.allUsers = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "You are not authorized!" });
    }
    if (user.role !== "admin") {
      return res.status(401).json({ message: "You must be an admin to perform this role" });
    }
    const all_users = await User.find();
    return res.status(200).json({ Total_count: all_users.length, All_users: all_users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};


exports.isBlocked = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "You are not authorized!" });
    }

    if (user.role !== "admin") {
      return res.status(401).json({ message: "You must be an admin to perform this role" })};
      
    const blocked = await User.findOneAndUpdate(
    { _id: req.params.id }, [
        { $set: { isBlocked: { $not: '$isBlocked' } } },
      ]);
      return res.status(200).json(blocked);
    } catch (error) {
      next(error);
    };
  }
  

