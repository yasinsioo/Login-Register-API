const router = require('express').Router();
const { checkToken } = require('../middlewares/auth.js');
const {
  login,
  register,
  me,
  forgotPassword,
  resetCodeCheck,
  resetPassword,
} = require('./../controllers/authController.js');
const authValidation = require('./../middlewares/validations/authValidation.js');

router.post('/login', authValidation.login, login);
router.post('/register', authValidation.register, register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-code-check', resetCodeCheck);
router.get('/me', checkToken, me);
router.post('/reset-password', resetPassword);
module.exports = router;
