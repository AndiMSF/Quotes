const router = require('express').Router()
const passport = require('passport');

// Require User Model
const User = require('../models/User');

// create passport local strategy
passport.use(User.createStrategy())

// Serialize and deserialize user
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
// Register User in DB
router.post('/auth/register', async (req,res) => {
    try {
        // Register User
        const registerUser = await User.register({username: req.body.username}, req.body.password)
        if(registerUser){
            passport.authenticate('local')(req, res, function() {
                res.redirect('/quotes')
            })
        } else {
            res.redirect('/register')
        }

    } catch (err) {
        res.send(err)
    }
})
// Login User
router.post('/auth/login', (req, res) => {
    // Create new uier object
    const user = new User({
        username: req.body.username,
        password: req.body.passport
    });

    // Using passport login method we will check if user credentials are correct or not
    req.login(user, (err) => {
        if(err){
            console.log(err);
        } else {
            passport.authenticate('local')(req,res, function(){
                res.redirect('/quotes')
            })
        }
    })
})

router.get('/auth/logout', (req,res) => {
    // use parrpot logout method
    req.logout(err => {
        if(err)
        {
            console.log(err);
        }
        res.redirect('/')     
    });
   
})

// export router
module.exports = router;