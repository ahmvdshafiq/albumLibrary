const express = require('express');
const router = express.Router();
const Author = require('../models/userr');
const Book = require('../models/book');
const user = require('../models/user');

// Get all Authors
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name) {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const users = await Author.find(searchOptions);
    let locals = {
      users,
      searchOptions: req.query
    };
    res.render('users/index', locals);
  } catch {
    res.redirect('/');
  }
});

router.get('/new', (req, res) => {
  let locals = {
    user: new user()
  };
  res.render('users/new', locals);
});

router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name
  });

  try {
    const newUser= await user.save();
    res.redirect(`users/${newUser.id}`);
  } catch {
    let locals = {
      author: user,
      errorMessage: 'Error Creating User'
    };
    res.render('users/new', locals);
  }
});



router.get('/:id/edit', async (req, res) => {
  try {
    const author = await User.findById(req.params.id);
    res.render('users/edit', { user: user });
  } catch {
    res.redirect('/users');
  }
});

router.put('/:id', async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    user.name = req.body.name;
    await user.save();
    res.redirect(`/users/${user.id}`);
  } catch {
    if (user == null) {
      res.redirect('/');
    } else {
      let locals = {
        user: user,
        errorMessage: 'Error Updating Author'
      };
      res.render('users/edit', locals);
    }
  }
});

router.delete('/:id', async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    await user.remove();
    res.redirect(`/users`);
  } catch {
    if (user == null) {
      res.redirect('/');
    } else {
      res.redirect(`/users/${user.id}`);
    }
  }
});
module.exports = router;
