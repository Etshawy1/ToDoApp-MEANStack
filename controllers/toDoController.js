const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const ToDo = require('../models/toDoModel');
const User = require('../models/userModel');
const _ = require('lodash');

exports.deleteToDo = catchAsync(async (req, res, next) => {
  const doc = await ToDo.findById(req.params.id, {
    owner: req.user.id
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  await doc.delete();

  res.status(204).json({});
});

exports.updateToDo = catchAsync(async (req, res, next) => {
  const doc = await ToDo.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    _.pick(req.body, ['content', 'checked', 'checkedAt', 'createdAt']),
    {
      new: true,
      runValidators: true
    }
  );

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json(doc);
});

exports.createToDo = catchAsync(async (req, res, next) => {
  const doc = await ToDo.create({ ...req.body, owner: req.user._id });

  res.status(201).json(doc);
});

exports.getToDo = catchAsync(async (req, res, next) => {
  const doc = await ToDo.findOne({ _id: req.params.id, owner: req.user.id });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json(doc);
});

exports.getAllToDos = catchAsync(async (req, res, next) => {
  const docs = await ToDo.find({ owner: req.user._id }).sort({
    checked: 1,
    createdAt: -1,
    checkedAt: 1
  });

  // SEND RESPONSE
  res.status(200).json(docs);
});
