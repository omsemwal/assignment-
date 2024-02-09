const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/routes');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();
const dotenv= require("dotenv");

dotenv.config({
  path: './env',
});
 
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://16039233:16039233@hariom-semwal.ylnslae.mongodb.net/assignment", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 9902, function () {
    console.log('Express app running on port ' + (process.env.PORT || 9902))
});
