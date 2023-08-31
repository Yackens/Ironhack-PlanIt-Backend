const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userPrefixName: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
