const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
 
   
    email: { type: String,require:true } ,
    name: { type: String,require:true } ,
    password :{type:String,require: true},
    razorpayAccountId:{ type: String,require:true }, 
    
  
},{timestamps:true});

UserSchema .methods.encryptPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema .methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', UserSchema);


