const mongoose = require("mongoose");

const TransferSchema = new mongoose.Schema( {
   
    senderEmail: String, 
    receiverEmail: String, 
    amount: Number, 
    status: {type:String,  default:"Pending"}, // Pending or Completed
  });
  
  module.exports = mongoose.model("Transaction", TransferSchema);

  



// const TransactionSchema = new mongoose.Schema({
  
//     razorpay_order_id: String,
//     razorpay_payment_id: String,
//     razorpay_signature: String,
//     amount: Number,
//     currency: String,
//     status: String,
//     email: String,//   type: { type: String, enum: ["deposit", "withdrawal"], required: true },
//     date: { type: Date, default: Date.now },
// },{timestamps:true});

// module.exports = mongoose.model("Transaction", TransactionSchema);
