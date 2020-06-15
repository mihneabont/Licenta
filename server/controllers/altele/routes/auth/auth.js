const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { registerValidation, loginValidation } = require("../../../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

//Connect to DB

mongoose.connect(
  process.env.DB_CONNECT,
  { useCreateIndex: true, useNewUrlParser: true },
  () => console.log("connected to db!")
);

//USer Schema

const User = require("../../model/User");

//Validation

const Joi = require("@hapi/joi");

const Vschema = {
  name: Joi.string()
    .min(6)
    .required(),
  email: Joi.string()
    .min(6)
    .required()
    .email(),
  password: Joi.string()
    .min(6)
    .required()
};

const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send("Error validation");

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email unique error");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    prenume: req.body.prenume,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  //VALIDATE DATA
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send("Error validation");
  //CHECK EMAIL EXISTS
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is wrong");
  //CHECK PASSWORD CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Pass not valid");
  //CREATE AND ASSIGN TOKEN
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
