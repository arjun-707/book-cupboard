const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Books = new Schema({
  title: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  authors: {
    type: [String]
  },
  publisher: {
    type: String
  },
  publishedDate: {
    type: String
  },
  description: {
    type: String
  },
  pageCount: {
    type: Number
  },
  language: {
    type: String,
    // enum: ['en', 'eu', 'hi', 'rus', 'chi', 'ur', 'fr']
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  updatedBy: {
    type: String
  }
}, {
  timestamps: true
})

mongoose.model('Books', Books);
