const notfound = (req, res) => {
  res.send(
    `Sorry, The Route you are searching for doesn't exist ! Please Try Something else`
  );
};

module.exports = notfound;
