require('dotenv').config();
const jwt = require('jsonwebtoken');
const APIError = require('../utils/errors.js');
const user = require('../models/userModel.js');

const createToken = async (user, res) => {
  const payload = {
    sub: user._id,
    name: user.name,
  };

  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    algorithm: 'HS512',
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(201).json({
    success: true,
    token,
    message: 'Successful',
  });
};
const checkToken = async (req, res, next) => {
  const headerToken =
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ');

  if (!headerToken) {
    throw new APIError('Youre not logged in.', 401);
  }

  const token = req.headers.authorization.split(' ')[1];

  await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      throw new APIError('Unvalid token.', 401);
    }
    const checkUser = await user
      .findById(decoded.sub)
      .select('_id name lastname email');
    if (!checkUser) {
      throw new APIError('Unvalid token.', 401);
    }
    req.user = checkUser;
  });
  next();
};

const createTempToken = async (userId, email) => {
  const payload = {
    sub: userId,
    email,
  };
  const token = await jwt.sign(payload, process.env.JWT_TEMP_SECRET_KEY, {
    algorithm: 'HS512',
    expiresIn: process.env.JWT_TEMP_EXPIRES_IN,
  });

  return 'Bearer ' + token;
};
const decodedTempToken = async (tempToken) => {
  const token = tempToken.split(' ')[1];
  let checkUser;
  await jwt.verify(
    token,
    process.env.JWT_TEMP_SECRET_KEY,
    async (err, decoded) => {
      if (err) throw new APIError('Unvalid token.', 401);
      const checkUser = await user
        .findById(decoded.sub)
        .select('_id name lastname email');
      if (!checkUser) throw new APIError('Unvalid token', 401);
    }
  );
  return checkUser;
};
module.exports = {
  createToken,
  checkToken,
  createTempToken,
  decodedTempToken,
};
