const router = require('express').Router();

const auth = require('./authRoutes.js');

router.use('/auth', auth);

module.exports = router;
