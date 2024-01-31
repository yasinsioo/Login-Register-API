const user = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const APIError = require('../utils/errors.js');
const Response = require('../utils/response.js');
const {
  createToken,
  createTempToken,
  decodedTempToken,
} = require('../middlewares/auth.js');
const crypto = require('crypto');
const sendEmail = require('../utils/sendMail.js');
const moment = require('moment');

const login = async (req, res) => {
  const { email, password } = req.body;
  const userCheck = await user.findOne({ email });
  if (!userCheck) {
    throw new APIError('This email is not registered.', 401);
  }
  const comparePassword = await bcrypt.compare(password, userCheck.password);
  if (!comparePassword) {
    throw new APIError('Your password is wrong. Try again', 401);
  }
  createToken(userCheck, res);
};
const register = async (req, res) => {
  const { email } = req.body;
  const userCheck = await user.findOne({ email });
  if (userCheck) {
    throw new APIError('Email is already in use.', 401);
  }
  req.body.password = await bcrypt.hash(req.body.password, 10);
  try {
    const userSave = new user(req.body);
    await userSave
      .save()
      .then((data) => {
        return new Response(
          data,
          'You are successfully registered.',
          201
        ).created(res);
      })
      .catch((err) => {
        throw new APIError('Kullanıcı kayıt edilemedi', 400);
      });
  } catch (error) {
    throw new APIError('Kullanıcı kayıt edilemedi', 400);
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const checkUser = await user
    .findOne({ email })
    .select(' name lastname email');
  if (!checkUser) {
    return new APIError('Unvalid user.', 400);
  }
  const resetCode = crypto.randomBytes(3).toString('hex');

  await sendEmail({
    from: 'smtpRestAPI@outlook.com',
    to: checkUser.email,
    subject: 'Reset your password',
    text: `Şifre sıfırlama kodunuz: ${resetCode}`,
  });

  await user.updateOne(
    { email },
    {
      reset: {
        code: resetCode,
        time: moment(new Date())
          .add(15, 'minute')
          .format('YYYY-MM-DD HH:mm:ss'),
      },
    }
  );
  return new Response(true, 'Please check your mail inbox.').success(res);
};
const resetCodeCheck = async (req, res) => {
  const { email, code } = req.body;
  const checkUser = await user
    .findOne({ email })
    .select('_ id name last name email reset');
  if (!checkUser) throw new APIError('Unvalid code.', 401);

  const dbTime = moment(checkUser.reset.time);
  const timeNow = moment(new Date());
  const timeDiff = dbTime.diff(timeNow, 'minutes');
  console.log(timeDiff);

  if (timeDiff <= 0 || checkUser.reset.code !== code) {
    throw new APIError('Unvalid or expired code.', 401);
  }

  const tempToken = await createTempToken(checkUser._id, checkUser.email);

  return new Response({ tempToken }, 'You can change your password').success(
    res
  );
};
const resetPassword = async (req, res) => {
  const { password, tempToken } = req.body;
  const decodedToken = await decodedTempToken(tempToken);
  console.log('decodedToken: ', decodedToken);

  const hashPassword = await bcrypt.hash(password, 10);

  await user.findByIdAndUpdate(
    {
      _id: decodedToken._id,
    },
    {
      reset: {
        code: null,
        time: null,
      },
      password: hashPassword,
    }
  );

  return new Response(
    decodedToken,
    'You successfully changed your password'
  ).success(res);
};

const me = async (req, res) => {
  return new Response(req.user).success(res);
};
module.exports = {
  login,
  register,
  me,
  forgotPassword,
  resetCodeCheck,
  resetPassword,
};
