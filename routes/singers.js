const express = require('express');
const router = express.Router();
const Singer = require('../models/singer');
const Album = require('../models/album');

//get all singers
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name) {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const singers = await Singer.find(searchOptions);
    let locals = {
      singers,
      searchOptions: req.query
    };
    res.render('singers/index', locals);
  } catch {
    res.redirect('/');
  }
});


router.get('/new', (req, res) => {
  let locals = {
    singer: new Singer()
  };
  res.render('singers/new', locals);
});

router.post('/', async (req, res) => {
  const singer = new Singer({
    name: req.body.name
  });

  try {
    const newSinger = await singer.save();
    res.redirect(`singers/${newSinger.id}`);
  } catch {
    let locals = {
      singer: singer,
      errorMessage: 'Error Creating Singer'
    };
    res.render('singer/new', locals);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const singer = await Singer.findById(req.params.id);
    const albums = await Album.find({ singer: singer.id })
      .limit(6)
      .exec();
    let locals = {
      singer,
      albumsBySinger: albums
    };
    res.render('singers/show', locals);
  } catch {
    res.redirect('/');
  }
});

router.get('/:id/edit', async (req, res) => {
  try {
    const singer = await Singer.findById(req.params.id);
    res.render('singers/edit', { singer: singer });
  } catch {
    res.redirect('/singers');
  }
});

router.put('/:id', async (req, res) => {
  let singer;
  try {
    singer = await Singer.findById(req.params.id);
    singer.name = req.body.name;
    await singer.save();
    res.redirect(`/singers/${singer.id}`);
  } catch {
    if (singer == null) {
      res.redirect('/');
    } else {
      let locals = {
        singer: singer,
        errorMessage: 'Error Updating Author'
      };
      res.render('singers/edit', locals);
    }
  }
});

router.delete('/:id', async (req, res) => {
  let singer;
  try {
    singer = await Singer.findById(req.params.id);
    await singer.remove();
    res.redirect(`/singers`);
  } catch {
    if (singer == null) {
      res.redirect('/');
    } else {
      res.redirect(`/singers/${singer.id}`);
    }
  }
});
module.exports = router;
