const errorHandler = (err, req, res, next) => {
  res.json({ msg: `Error Occured : ${err}` });
  console.log(err);
  next();
};
module.exports = errorHandler;
