const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connected succesfully.');
  })
  .catch((err) => {
    console.log("Error: Couldn't connect to the database.");
  });
