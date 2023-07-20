const express = require('express');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const router = express.Router();
const Album = require('../models/album');
const Singer = require('../models/singer');

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
    res.render('albums/index', locals);
  } catch {
    res.redirect('/');
  }
});

// New Album route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Album());
});

// Create Album Route
router.post('/', async (req, res) => {
  let { title, singer, publishDate, track, description, cover } = req.body;
  const album = new Album({
    title,
    singer,
    publishDate: new Date(publishDate),
    track: track,
    description: description
  });
  saveCover(album, cover);
  try {
    const newSinger = await album.save();
    res.redirect(`albums/${newSinger.id}`);
  } catch {
    renderNewPage(res, album, true);
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
    res.render('albums/show', locals);
  } catch {
    res.redirect('/');
  }
});

// Edit Album route
router.get('/:id/edit', async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    renderEditPage(res, album);
  } catch {
    res.render('/');
  }
});

// Update Album Route
router.put('/:id', async (req, res) => {
  let album;
  try {
    album = await Album.findById(req.params.id);
    album.title = req.body.title;
    album.singer = req.body.singer;
    album.publishDate = new Date(req.body.publishDate);
    album.track = req.body.track;
    album.description = req.body.description;
    if (req.body.cover) {
      saveCover(album, req.body.cover);
    }
    // console.log(album);
    await album.save();
    res.redirect(`/albums/${album.id}`);
  } catch {
    if (album) {
      renderEditPage(res, album, true);
    } else {
      redirect('/');
    }
  }
});

// Delete Album
router.delete('/:id', async (req, res) => {
  let album;
  try {
    album = await Album.findById(req.params.id);
    await album.remove();
    res.redirect('/albums');
  } catch {
    if (album) {
      let locals = {
        album,
        errorMessage: 'Could not remove album'
      };
      res.render('albums/show', locals);
    } else {
      res.redirect('/');
    }
  }
});

let renderNewPage = async (res, album, hasError = false) => {
  renderFormPage(res, album, 'new', hasError);
};

let renderEditPage = async (res, album, hasError = false) => {
  renderFormPage(res, album, 'edit', hasError);
};

let renderFormPage = async (res, album, form, hasError = false) => {
  try {
    const singers = await Singer.find({});
    let locals = {
      singers,
      album
    };
    if (hasError) {
      this.param.errorMessage = `Error ${
        form === 'edit' ? 'Updating' : 'Creating'
      } Album`;
    }
    res.render(`albums/${form}`, locals);
  } catch {
    res.redirect('/albums');
  }
};

let saveCover = (album, coverEncoded) => {
  if (coverEncoded) {
    const cover = JSON.parse(coverEncoded);
    if (cover && imageMimeTypes.includes(cover.type)) {
      album.coverImage = new Buffer.from(cover.data, 'base64');
      album.coverImageType = cover.type;
    }
  }
  return;
};
module.exports = router;
