const mongoose = require('mongoose');
 const jwt= require("jsonwebtoken")
 const User=require('../models/userModel')

 const verifyJwt = async (req, res, next) => {
  try {
      const token = req.header("Authorization")?.replace("Bearer", "").trim();
      //console.log(token, " successfully");
      
      if (!token) {
          return res.status(401).json("unauthorized request !");
      }
      
      const decodetoken = jwt.verify(token, "uegfuegtugfuagcugc");
      if (!decodetoken) {
          return res.status(401).json(" decodetoken not match !");
      }
      
      //console.log(decodetoken)
      const user = await User.findById(decodetoken?.id).select("-password");
      //console.log(user)
      
      if (!user) { 
          return res.status(401).json({ msg: "invalid access token" });
      }
      
      req.user = user;
      next();
  } catch (error) { 
      return res.status(500).json({ error: error?.message, message: "server error" });
  }
};

    module.exports ={ verifyJwt };