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
    res.render('singersuser/indexuser', locals);
  } catch {
    res.redirect('/');
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
      res.render('singersuser/showuser', locals);
    } catch {
      res.redirect('/');
    }
  });

  module.exports = router;