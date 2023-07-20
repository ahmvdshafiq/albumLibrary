const mongoose = require('mongoose');
const Album = require('./album');
const singerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

singerSchema.pre('remove', function(next) {
  Book.find({ singer: this.id }, (err, books) => {
    if (err) {
      next(err);
    } else if (books.length > 0) {
      next(new Error('This singer has books still'));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model('Singer', singerSchema);