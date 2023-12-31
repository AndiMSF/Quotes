require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const ejs = require('ejs');

// require routes
const authRoute = require('./routes/auth');
const quoteRoute = require('./routes/quote')

const app = express();

// setup view engine EJS, body-parser and express static
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// setup session
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// initialize passport
app.use(passport.initialize());
// use passport to deal with session
app.use(passport.session());

// Connect to Database
mongoose.connect(process.env.DB_CONNECT)
.then(()=>console.log("Database Connected"))
.catch(err => console.log(err))

// use Routes
app.use('/', authRoute);
app.use('/', quoteRoute);



// Start the server
app.listen(process.env.PORT, ()=> console.log("Server Running"));