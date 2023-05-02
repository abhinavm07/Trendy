const asyncHandler = require("express-async-handler");
const savedSchema = require("../model/savedChartsSchema");

const saveChart = asyncHandler(async (req, res) => {
  const { createdBy, chartOptions, data, deletedAt, chartID } = req.body;

  // validation
  if (!createdBy || !data) {
    res.status(400);
    throw new Error("Please Include all fileds");
  }

  console.log(createdBy, chartOptions, data, deletedAt);
  // //find one where isDeleted is null
  if (chartID) {
    const chartsExists = await savedSchema.findOne({ chartID });
    if (chartsExists) {
      res.status(200).json(chartsExists);
      throw new Error("Chart Already Saved");
    }
  }

  const stackCharts = await savedSchema.create({
    createdBy,
    data,
    chartOptions,
    deletedAt,
  });
  console.log(stackCharts);

  if (stackCharts) {
    res.status(201).json({
      _id: savedSchema._id,
      createdBy: savedSchema.createdBy,
      data: savedSchema.data,
      chartsOptions: savedSchema.chartOptions,
      deletedAt: savedSchema.deletedAt,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const deleteChart = async (req, res) => {
  const { _id: chartID, isDeleted } = req.body;
  //if chart has isDeleted dont do anything else delete
  if (isDeleted) {
    res.status(400);
    throw new Error("Chart has already been deleted");
  }
  const delChart = await savedSchema.findByIdAndDelete({ _id: chartID });
  console.log(delChart);
  res.status(200).json({ msg: `Chart with the ID of : ${chartID} deleted !` });
};

const addDataChart = async (req, res) => {
  const { data, _id: chartID } = req.body;
  const charts = await savedSchema.findById({ _id: chartID });
  charts["data"].push(data);
  res.status(200).json({ msg: "Successful !", charts });
};

const retrieveChart = async (req, res) => {
  const { userID } = req.body;
  const charts = await savedSchema.find({ createdBy: userID });
  res.status(200).json({ msg: charts });
};

const savedChart = async (req, res) => {
  //userID, chartId
  //check if chartid for userid exists and isDeleted null
  const { userID, _id: chartID, isDeleted } = req.body;
  if (userID && chartID && !isDeleted) {
    console.log("ÏN");
    const chartsExists = await savedSchema.findOne({ _id: chartID });
    if (chartsExists["createdBy"] == userID) {
      res.status(200).json(chartsExists);
    }
  }
  console.log(userID, chartID, isDeleted);
};

const unSaveChart = async (req, res) => {
  //check if chart has been saved savedChart()
  //if savedChart true then check if chart has been shared in shared table
  //if shared then set isDeleted as current date
  const { userID, _id: chartID, isDeleted } = req.body;
  if (userID && chartID && !isDeleted) {
    console.log("Out");
    const shared = await savedSchema.findOne({ _id: chartID });
    if (shared["createdBy"] == userID) {
      savedSchema["isDeleted"] = Date;
    }
  }
};

module.exports = {
  saveChart,
  deleteChart,
  retrieveChart,
  addDataChart,
  savedChart,
  unSaveChart,
};
