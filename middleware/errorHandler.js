const errorHandler = (err, req, res, next) => {
  res.json({ msg: `Error Occured ${err}` });
  next();
};
module.exports = errorHandler;
