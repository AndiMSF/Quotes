const router = require('express').Router();

// Require Quote Model
const Quote = require('../models/Quote');

// Create Routes
// Get Home
router.get('/', (req, res) => {
    // Check if user logged in ? redirect to quote pages 
    if(req.isAuthenticated()) {
        res.redirect('/quotes')
    }else {
        res.render('index')
    }
})

router.get('/register', (req, res) => {
    // Check if user logged in ? redirect to quote pages 
    if(req.isAuthenticated()) {
        res.redirect('/quotes')
    }else {
        res.render('register')
    }
})

// Login page
router.get('/login', (req, res) => {
    // Check if user logged in ? redirect to quote pages 
    if(req.isAuthenticated()) {
        res.redirect('/quotes')
    }else {
        res.render('login')
    }
})

// Get Quotes Page (Fetch data from DB and send to quotes page)
router.get('/quotes', async (req, res) => {
    try {
        // Fetch all quptes from db
        const allQuotes = await Quote.find()
        res.render('quotes', {allQuotes, isAuth: req.isAuthenticated()});
    } catch(err) {
        res.send(err)
    }
})

// Submit page
router.get('/submit', (req, res) => {
    // Check if user logged in ? redirect to quote pages 
    if(req.isAuthenticated()) {
        res.render('submit')
    }else {
        res.render('register')
    }
})

// POST
// Submit a Quote and add to Database
router.post('/submit', async (req, res) => {
    try {
        const quote = new Quote({
            quote: req.body.quote,
            bgColor: req.body.bgcolor.substring(1) // color will send in hex format (#eee) so we remove #
        });
        // save quote in db
        const saveQuote = quote.save();
        !saveQuote && res.redirect('/submit');
        res.redirect('/quotes');
    } catch(err) {
        res.send(err)
    }
})

// like quotes
router.post('/quotes/like', async (req, res) => {
    try {
        // find the post to update likes
        const post = await Quote.findById(req.body.likesBtn);
        const updateLikes = await post.updateOne({likes: post.likes+1});
        // redirect to quotes page
        res.redirect('/quotes');
    } catch(err){
        console.log(err);
    }
})

module.exports = router