const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

/**
 * @module Models.toDo
 */

const toDoSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'to do cannot be empty']
  },
  checked: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'a to do should have a user']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  checkedAt: Date
});

toDoSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: 'all'
});

const ToDo = mongoose.model('ToDo', toDoSchema);

module.exports = ToDo;
