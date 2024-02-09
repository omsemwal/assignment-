const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const head = require("../models/userModel.js"); 



const getUser=async (req,res)=>{
let abc=req.user
  return res.json({data:abc})

}
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, "uegfuegtugfuagcugc", {
    expiresIn: 86400, // 24 hours
  });
};

const signup = async (req, res) => {
  const { email, password, razorpayAccountId } = req.body;

  if (!email || !password )
    return res
      .status(400)
      .send({ error: "Please enter all the details, email, password, , razorpayAccountId" });

  try {
    const existingUser = await head.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this emailId " });
    }

    const newUser = await head.create({
      email,
      password,
     
      razorpayAccountId,
    });

    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();

    const token = generateToken(newUser._id);

    return res.status(200).json({ success: "User created", token });
  } catch (error) {
    return res.status(500).json({ error: "Error creating user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await head.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = generateToken(user._id);

    res.json({ success: "User logged in", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
};


module.exports = { getUser,login, signup };
