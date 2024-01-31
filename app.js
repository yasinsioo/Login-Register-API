require('express-async-errors');
const express = require('express');
const app = express();
require('dotenv').config();
require('./src/db/dbConnection.js');
const errorHandlerMiddleware = require('./src/middlewares/errorHandler.js');
const cors = require('cors');
const corsOptions = require('./src/helpers/corsOptions.js');
const mongoSanitize = require('express-mongo-sanitize');
const router = require('./src/routers');
const apiLimiter = require('./src/middlewares/rateLimit.js');
const moment = require('moment-timezone');

moment.tz.setDefault('Europe/Istanbul');
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use('/api/auth', apiLimiter);
app.use(express.json());
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);

app.use('/api', router);

// error handler
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
