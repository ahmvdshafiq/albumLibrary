const express = require('express');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const router = express.Router();
const Album = require('../models/album');


// Get all Albums
router.get('/', async (req, res) => {
  let query = Album.find();
  if (req.query.title) {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }
  if (req.query.publishedBefore) {
    query = query.lte('publishDate', req.query.publishedBefore);
  }
  if (req.query.publishedAfter) {
    query = query.lte('publishDate', req.query.publishedAfter);
  }
  try {
    const albums = await query.exec();
    let locals = {
      albums,
      searchOptions: req.query
    };
    res.render('albumsuser/indexuser', locals);
  } catch {
    res.redirect('/');
  }
});

//Show Album Route
router.get('/:id', async (req, res) => {
    try {
      const album = await Album.findById(req.params.id)
        .populate('singer')
        .exec();
      let locals = {
        album
      };
      res.render('albumsuser/showuser', locals);
    } catch {
      res.redirect('/');
    }
  });

  module.exports = router;
  