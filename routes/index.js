const express = require('express');
const router = express.Router();


const User = require('../models/user');
const Albums = require('../models/album');


router.get('/', async (req, res) => {
  res.redirect('/login')
});

router.get('/login', async (req, res) => {
  res.render('login');
  
});

router.get('/indexuser', async (req, res) => {
  let albums;
      try {
        albums = await Albums.find().sort({ createdAt: 'desc' }).limit(10).exec();
        let locals = {
          albums
        }
        res.render('indexuser', locals);
      } catch {
        albums = []
      }
  
});

router.get('/index', async (req, res) => {
  let albums;
      try {
        albums = await Albums.find().sort({ createdAt: 'desc' }).limit(10).exec();
        let locals = {
          albums
        }
        res.render('index', locals);
      } catch {
        albums = []
      }
  
});



router.post('/login', express.urlencoded({ extended: false }), async function(req, res){ 
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    // Check if the password matches
    if (user.password !== password) {
      // Incorrect password
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    // Password is correct, user is authenticated

    // Check if the user has the allowed email
    if (user.email === 'admin@gmail.com') {
      // User is allowed to access the page
      res.redirect('/index')
    } else {
      // Redirect other users to a different page
      res.redirect('/indexuser')
    }

  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred');
    res.redirect('/login');
  }
})
  router.get('/register', async (req, res) => {
    res.render('register');
    
  });

  router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // return res.status(400).json({ error: 'Email is already registered' });
      }
  
      // Create a new user
      const user = new User({ username, email, password });
      await user.save();
  
      // User registration successful
      res.redirect('/login')
      // res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      // res.status(500).json({ error: 'An error occurred during user registration' });
    }
  });

  router.get('/logout', async (req, res) => {
    res.redirect('/');
    
  });
module.exports = router;
