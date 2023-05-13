const asyncHandler = require("express-async-handler");
const savedChartSchema = require("../model/savedChartsSchema");

const saveChart = asyncHandler(async (req, res) => {
  const { chartOptions, data, deletedAt, chartID } = req.body;
  const createdBy = req.user.email;
  // validation
  if (!createdBy || !data) {
    res.status(400);
    throw new Error("Please Include all files");
  }

  // //find one where isDeleted is null
  if (chartID) {
    const chartsExists = await savedChartSchema.findOne({ _id: chartID });
    if (chartsExists) {
      return res
        .status(400)
        .json({ msg: "Chart Already Saved", data: chartsExists });
      // throw new Error("Chart Already Saved");
    }
  }

  const stringifiedChartOptions = JSON.stringify(chartOptions || {});
  const stackCharts = await savedChartSchema.create({
    createdBy,
    data,
    chartsOptions: stringifiedChartOptions,
    deletedAt,
  });

  if (stackCharts) {
    res.status(201).json({
      _id: stackCharts._id,
      saved: true,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const deleteChart = async (req, res) => {
  const { chartID, createdBy } = req.body;
  //if chart has isDeleted dont do anything else delete
  const savedChartExists = await savedChartSchema.findOne({
    _id: chartID,
    createdBy: createdBy,
    isDeleted: true,
  });
  if (savedChartExists) {
    res.status(400).json({
      msg: `Tweet with the ID of : ${chartID} has already been deleted !`,
    });
    // throw new Error("Tweet has already been deleted");
  }
  const delTweet = await savedChartSchema.findOneAndUpdate(
    { _id: chartID },
    { isDeleted: true },
    { deletedAt: new Date() }
  );
  res.status(200).json({ msg: `Tweet with the ID of : ${chartID} deleted !` });
};

const addDataChart = async (req, res) => {
  const { data, _id: chartID } = req.body;
  if (chartID) {
    const savedChartExists = await savedChartSchema.findById({
      _id: chartID,
    });
    if (savedChartExists) {
      const appendData = await savedChartSchema.findOneAndUpdate(
        { _id: chartID },
        { data: data }
      );
      return res.status(200).json({ msg: "Successful !", appendData });
    }
    res.status(404).json({ msg: "No such tweet found" });
  }
};

const retrieveChart = async (req, res) => {
  const { email } = req.user;
  const savedChart = await savedChartSchema
    .find({
      createdBy: email,
      isDeleted: false,
    })
    .sort({ createdAt: -1 });
  res.status(200).json(savedChart);
};

const savedChart = async (userID, chartID) => {
  if (userID && chartID) {
    const chartsExists = await savedChartSchema.findOne({
      _id: chartID,
      createdBy: email,
      isDeleted: false,
    });
    if (chartsExists) {
      return true;
    }
    return false;
  }
};

const unSaveChart = async (req, res) => {
  //check if chart has been saved savedChart()
  //if savedChart true then check if chart has been shared in shared table
  //if shared then set isDeleted as current date
  const { userID, _id: chartID, isDeleted } = req.body;
  if (userID && chartID && !isDeleted) {
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
