const asyncHandler = require("express-async-handler");
const savedSchema = require("../model/savedChartsSchema");

const saveChart = asyncHandler(async (req, res) => {
  const { createdBy, chartOptions, data, deletedAt, chartID } = req.body;

  // validation
  if (!createdBy || !data) {
    res.status(400);
    throw new Error("Please Include all files");
  }

  // //find one where isDeleted is null
  if (chartID) {
    const chartsExists = await savedSchema.findOne({ _id: chartID });
    if (chartsExists) {
      return res
        .status(400)
        .json({ msg: "Chart Already Saved", data: chartsExists });
      // throw new Error("Chart Already Saved");
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
  const { chartID, createdBy } = req.body;
  //if chart has isDeleted dont do anything else delete
  const savedChartExists = await savedSchema.findOne({
    _id: chartID,
    createdBy: createdBy,
    isDeleted: true,
  });
  if (savedChartExists) {
    console.log("Here");
    res.status(400).json({
      msg: `Tweet with the ID of : ${chartID} has already been deleted !`,
    });
    // throw new Error("Tweet has already been deleted");
  }
  const delTweet = await savedSchema.findOneAndUpdate(
    { _id: chartID },
    { isDeleted: true },
    { deletedAt: new Date() }
  );
  res.status(200).json({ msg: `Tweet with the ID of : ${chartID} deleted !` });
};

const addDataChart = async (req, res) => {
  const { data, _id: chartID } = req.body;
  if (chartID) {
    const savedChartExists = await savedSchema.findById({
      _id: chartID,
    });
    if (savedChartExists) {
      const appendData = await savedSchema.findOneAndUpdate(
        { _id: chartID },
        { data: data }
      );
      return res.status(200).json({ msg: "Successful !", appendData });
    }
    res.status(404).json({ msg: "No such tweet found" });
  }
};

const retrieveChart = async (req, res) => {
  const { userID } = req.body;
  const savedChartExists = await savedSchema.find({
    createdBy: userID,
    isDeleted: false,
  });
  res
    .status(200)
    .json({ msg: savedChartExists, dataHits: savedChartExists.length });
};

const savedChart = async (userID, chartID) => {
  if (userID && chartID) {
    console.log("ÏN");
    const chartsExists = await savedSchema.findOne({
      _id: chartID,
      createdBy: userID,
      isDeleted: false,
    });
    if (chartsExists) {
      return true;
    }
    return false;
  }
  console.log(userID, chartID);
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
