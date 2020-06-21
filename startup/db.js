const mongoose = require('mongoose');

module.exports = function () {
  if (process.env.NODE_ENV == 'test') {
    mongoose
      .connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('DB connection successful! testing');
      })
      .catch(err => {
        console.log(err);
        process.exit(1);
      });
  } else {
    const DB = process.env.DATABASE.replace(
      '<password>',
      process.env.DATABASE_PASSWORD
    );
    mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('DB connection successful! online');
      })
      .catch(err => {
        console.log(err.message);
        const DBLocal = process.env.DATABASE_LOCAL;
        mongoose
          .connect(DBLocal, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
          })
          .then(() => {
            console.log('DB connection successful! local');
          })
          .catch(er => {
            console.log(er.message);
            process.exit(); /* an agresive why to stop the application */
          });
      });
  }
};
