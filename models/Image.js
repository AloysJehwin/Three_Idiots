const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true, unique: true },
  isFavorite: { type: Boolean, default: false },
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
