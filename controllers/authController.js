const { promisify } = require('util');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
/**
 * @module authController
 */

/**
 * sends response to the user
 * @param {object} user - user object retrieved from the database
 * @param {number} statusCode - the status code of the response
 * @param {object} res - the response object of express framework
 */
const createSendToken = (user, statusCode, res) => {
  const token = user.signToken();
  // Remove password from output
  user.password = undefined;
  user.__v = undefined;
  res.status(statusCode).json({
    token,
    user
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // insert the user data in the database
  console.log(req.body);
  const newUser = await User.create({
    ..._.pick(req.body, ['email', 'password', 'passwordConfirm', 'name'])
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = () => {
  return catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  });
};
