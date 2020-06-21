// Acknowledgments: code adapted from https://github.com/jonasschmedtmann/complete-node-bootcamp

module.exports = fn => {
  return async (req, res, next) => {
    // catch rejected promise (inside a function that takes three arguments)
    // to the global error handling middleware
    await fn(req, res, next).catch(next);
  };
};
