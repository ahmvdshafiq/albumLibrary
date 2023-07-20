const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  track: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImage: {
    type: Buffer,
    required: true
  },
  coverImageType: {
    type: String,
    required: true
  },
  singer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Singer'
  }
});

albumSchema.virtual('coverImagePath').get(function () {
  if (this.coverImage && this.coverImageType) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
});

module.exports = mongoose.model('Album', albumSchema);