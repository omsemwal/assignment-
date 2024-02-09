const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Transfer = require("../models/tranastionModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_test_codI9ou23j7Trm",
  key_secret: "rTGv5KMfywFg5MIMK6DhwNhm",
});

// // Controller function to search for a user by email
const paymetDetails = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide an email address" });
  }

  try {
    const user = await Transfer.find({
      $or: [{ senderEmail: email }, { receiverEmail: email }],
    });
    //console.log(user)

    if (!user ||!user[0]) {
      return res.status(400).json({ msg:"user not found" });
    } else {
      return res
        .status(200)
        .json({ success: true,  data:user});
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const CreatePayment = async (req, res) => {
  const { senderEmail, receiverEmail, amount } = req.body;

  try {
    // Retrieve sender and receiver from the database
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ success: false, message: 'Sender or receiver not found' });
    }
    if (!receiver.razorpayAccountId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Receiver does not have a Razorpay account",
        });}

    // ------------------Create a mock transfer response----------------------------------//
    const transferResponse = {
      account: receiver.razorpayAccountId, // Receiver's Razorpay account ID
      amount: amount * 100, // Amount in paisa (Indian currency)
      currency: "INR",
       account_id: sender.razorpayAccountId,
      // amount: amount * 100, // Amount in paisa (Indian currency)
      // currency: 'INR',
      //status: 'created',
      notes: {
        senderName: sender.name,
        receiverName: receiver.name,
      },
     
    };

    // =============================Save transfer details ======================================//
    const newTransfer = await Transfer.create({
      senderEmail,
      receiverEmail,
      amount,
      status: 'successful',
      razorpayTransferId: transferResponse.id,
    });

    res.status(200).json({ success: true, transfer: transferResponse });
  } catch (error) {
    if (error.code === 'BAD_REQUEST_ERROR') {

      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    console.error('Error during payment:', error);

    res.status(500).json({ success: false, error });
  }
};






////////=================completed api=====================//



// const CreatePayment = async (req, res) => {
//   const { senderEmail, receiverEmail, amount } = req.body;

//   try {
//     const sender = await User.findOne({ email: senderEmail });
//     const receiver = await User.findOne({ email: receiverEmail });

//     if (!sender || !receiver) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Sender or receiver not found" });
//     }

//     // Check if receiver has a Razorpay account ID
//     if (!receiver.razorpayAccountId) {
//       return res
//         .status(400)
//         .json({
//           success: false,
//           message: "Receiver does not have a Razorpay account",
//         });
//     }

//     // ===============Transfer money =========
//     const transferResponse = await razorpay.transfers.create({
//       account: receiver.razorpayAccountId, // Receiver's Razorpay account ID
//       amount: amount * 100, // Amount in paisa (Indian currency)
//       currency: "INR",
//     });

//     // ==========Create a transfer record in the database=====================//
//     const newTransfer = await Transfer.create({
//       senderEmail,
//       receiverEmail,
//       amount,
//       status: "successful",
//       razorpayTransferId: transferResponse.id,
//     });

//     res
//       .status(200)
//       .json({
//         success: true,
//         message: "Payment successful",
//         transfer: newTransfer,
//       });
//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error("Error during payment:", error);

//     // Check if the error indicates authentication failure
//     if (error && error.code === "BAD_REQUEST_ERROR") {
//       return res
//         .status(401)
//         .json({ success: false, message: "Authentication failed" });
//     }

//     // Handle other errors
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "An error occurred during payment processing",
//       });
//   }
// };

module.exports = { CreatePayment, paymetDetails };













//   }
// })
// const Razorpay = new razorpay({
// //   key_id: "rzp_live_VmwfZut7HZLlzs",
// //   key_secret: "yb10Vxt9lqje7Me1Xh0FwiUi",
//   // key_id: "rzp_test_oLefKxyv3eBlZn",
//   // key_secret: "Tv1YI0N1EQllmqfPlINjdvnC"
// });

// // ==============================Create a payment====================================//

// let amount=0;
// const CreatePayment = async function (req, res) {
//   console.log(req.body);
//   try {
//      amount = req.body.amount * 100;
//     const currency = req.body.currency;
//     const email = req.body.email;
//     const options = {
//       amount: amount,
//       currency: "INR",
//     };
//     console.log(options);
//     const order = await Razorpay.orders.create(options);
//     const payment = new Payment({
//       razorpay_order_id: order.id,
//       amount: amount / 100,
//       currency: currency,
//       status: 'created',
//       email: email,
//     });
//     await payment.save();
//     res.json({ orderId: order.id });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal server error');
//   }
// };

// const paymentsVerify = async function (req, res) {
//   console.log(req.body);
//   const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
//   console.log(razorpay_signature);
//   console.log(razorpay_order_id);
//   try {
//     const payment = await Payment.findOne({ razorpay_order_id });
//     // console.log(payment);
//     if (!payment) {
//       return res.status(400).send('Invalid payment');
//     }

//     let signaturebody = razorpay_order_id + "|" + razorpay_payment_id;
//     // console.log(signaturebody)
//     var generated_signature = crypto.createHmac('sha256', "yb10Vxt9lqje7Me1Xh0FwiUi").update(signaturebody.toString()).digest('hex');
//     // console.log(generated_signature);
//     // console.log(razorpaySignature);
//     if (generated_signature != razorpay_signature) {
//       return res.status(400).send('Invalid signature');
//     }

//     payment.razorpay_payment_id = razorpay_payment_id;
//     payment.razorpay_signature = razorpay_signature;
//     payment.status = 'paid';
//     await payment.save();
//     console.log(payment)
//     res.redirect(
//       `http://localhost:9000/paymentsuccess?reference=${razorpay_payment_id}&amount=${amount/100}`
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal server error');
//   }
// };
