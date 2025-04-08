const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  postDate: {
    type: Date,
    default: Date.now
  },
  published: {
    type: Boolean,
    default: false
  },
  category: {
    type: String, 
    default: ''
  },
  body: {
    type: String,
    default: ''
  },
  featureImage: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Item', itemSchema);
