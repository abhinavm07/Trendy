const data = require("../model/trendySchema");

const homePage = (req, res) => {
  // throw new Error("Testing Express async error package");

  res.send("Welcome to the Home Page");

  console.log("Hi Man");
};

const getUser = async (req, res) => {
  const { name, username, sort } = req.query;
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
  const dataOut = await results;
  res.status(200).json({ msg: dataOut, hits: dataOut.length });
};

const getStatic = async (req, res) => {
  try {
    const dataOut = await data.find({});
    res.status(200).json({ msg: dataOut });
  } catch (error) {
    console.log(error);
  }
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
