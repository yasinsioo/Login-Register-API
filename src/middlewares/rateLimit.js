const rateLimit = require('express-rate-limit');

const whitelist = ['::1'];

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: (req, res) => {
    if (req.url === '/login' || req.url === '/register') return 7;
    else return 100;
  },
  message: {
    success: false,
    message: 'Too many requests. Wait for a while',
  },
  // WHITELIST
  // skip: (req, res) => whitelist.includes(req.ip),
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
