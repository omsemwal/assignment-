const express = require('express');
const router = express.Router();
const  userController=require('../controller/userController')
const  transactionController=require('../controller/transactionController')
const middleware=require('../middleware/mid')

router.post("/login", userController.login)
router.post("/signup", userController.signup)
router.get("/getUser", middleware.verifyJwt,userController.getUser)
router.post("/CreatePayment", transactionController.CreatePayment)

router.get ("/:email", transactionController.paymetDetails)

module.exports = router;