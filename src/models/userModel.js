const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // kaydederken başındaki ve sonundaki boşlukları siler
    },
    lastname: {
      type: String,
      required: true,
      trim: true, // kaydederken başındaki ve sonundaki boşlukları siler
    },
    email: {
      type: String,
      required: true,
      trim: true, // kaydederken başındaki ve sonundaki boşlukları siler
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true, // kaydederken başındaki ve sonundaki boşlukları siler
    },
    reset: {
      code: {
        type: String,
        default: null,
      },
      time: {
        type: String,
        default: null,
      },
    },
  },
  { collection: 'users', timestamps: true }
);
const user = mongoose.model('users', userSchema);
module.exports = user;
