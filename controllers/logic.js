const data = require("../model/trendySchema");

const homePage = (req, res) => {
  // throw new Error("Testing Express async error package");

  res.send("Welcome to the Home Page");

  console.log("Hi Man");
};

const getUser = async (req, res) => {
  const { name, username, sort, fields } = req.query;
  const queryObj = {};

  if (name) {
    //regex le chai name same to same nabhayeni edi data ma search gareko element xa bhanye dekhauxa Example: req.query ma "Abhi" aayo bhanye resunts ma Abhinab, abhii, abhinavv testo aauxa (just "abhi include bha hunu paryo"), option i ko mathlabh case insensative ho
    //mongoose docs herney confuse bhayema
    queryObj.name = { $regex: name, $options: "i" };
  }

  if (username) {
    queryObj.username = username;
  }

  let results = data.find(queryObj);
  if (sort) {
    const sortLst = sort.split(",").join(" ");
    results = results.sort(sortLst);
  } else {
    results = results.sort("name");
    console.log("From Else");
  }
  if (fields) {
    const fieldsLst = fields.split(",").join(" ");
    //.select lets us select the needed data from the data base
    results = results.select(fieldsLst);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 2;
  const skip = (page - 1) * limit;
  //.skip skips the number of items from the database while limit limits the amount of data supplied to the frontend at a given time.  (read Mongoose docx if confused)
  results = results.skip(skip).limit(limit);
  const dataOut = await results;
  res.status(200).json({ msg: dataOut, hits: dataOut.length });
};

const getStatic = async (req, res) => {
  const dataOut = await data.find({});
  res.status(200).json({ msg: dataOut });
};

const addData = async (req, res) => {
  const dataOut = await data.create(req.query);
  res.status(200).json({ msg: "Successful !" });
};

const deleteData = async (req, res) => {
  const { id: dataID } = req.params;
  const dataOut = await data.findByIdAndDelete({ _id: dataID });
  res.status(200).json({ msg: `Data with ID : ${dataID} deleted !` });
};

module.exports = { homePage, getStatic, getUser, addData, deleteData };
