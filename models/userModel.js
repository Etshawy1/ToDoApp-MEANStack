const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @module Models.user
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide your name'],
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    minlength: 5,
    maxlength: 255,
    unique: [true, 'this email is already used'],
    lowercase: true,
    validate: [validator.isEmail, 'please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    maxlength: 1024,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  }
});

userSchema.pre('save', async function (next) {
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

/**
 * this function is to compare a provided password with the stored one
 * @function correctPassword
 * @param {string} candidatePassword - the provided password to be checked
 * @param {string} userPassword - the hashed password of the user from the database
 * @returns {boolean} - true if the password matches the one in the database
 */

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * to make a JWT token for the user using the is as payload
 * @function signToken
 * @returns {string} - a json web token to identify the user and to be used in bearer token authorization
 */

userSchema.methods.signToken = function () {
  return jwt.sign(
    {
      id: this._id
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_VALID_FOR
    }
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
