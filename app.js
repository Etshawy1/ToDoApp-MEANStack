require('dotenv').config();
const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/sanitization')(app);
require('./startup/db')();

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
