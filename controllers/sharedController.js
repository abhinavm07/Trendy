const asyncHandler = require("express-async-handler");
const sharedSchema = require("../model/sharedSchema");
const { getUser } = require("./admin");

const shareContent = asyncHandler(async (req, res) => {
  const { savedInfo } = req.body;
  const { contentType, sharedTo, savedId } = savedInfo;
  const sharedBy = req.user.email;

  if (!contentType || !sharedBy || !sharedTo) {
    res.status(400);
    throw new Error("Please Include all fileds");
  }

  if (contentType.toLowerCase() === "chart" || "tweet") {
    if (sharedBy === sharedTo) {
      res
        .status(400)
        .json({ msg: "You cannot share to yourself", type: "error" });
    }

    const userExists = await getUser(sharedTo);
    if (!userExists) {
      res.status(400).json({ msg: "User does not exist", type: "error" });
    }

    const contentExists = await sharedSchema.findOne({
      savedId: savedId,
      sharedBy: sharedBy,
      sharedTo: sharedTo,
    });
    if (contentExists) {
      res
        .status(200)
        .json({
          msg: "Content has Already been Shared",
          type: "error",
          data: contentExists,
        });
      throw new Error("Content has Already been Shared");
    }

    const sharedContents = await sharedSchema.create({
      contentType,
      sharedTo,
      sharedBy,
      // isDeleted,
      // data,
      savedId,
    });

    if (sharedContents) {
      res
        .status(201)
        .json({
          msg: "Content Shared Successfully",
          type: "success",
          data: sharedContents,
        });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

const retrieveAllSharedContent = async (req, res) => {
  const charts = await retrieveSharedCharts(req, res);
  const tweets = await retrieveSharedTweets(req, res);
  res.status(200).json({ charts, tweets });
};

const retrieveSharedCharts = async (req, res) => {
  const { email } = req.user;
  //find in sharedSchema and join savedSchema
  const charts = await sharedSchema.aggregate([
    {
      $match: {
        sharedTo: email,
        contentType: "chart",
        isDeleted: false,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $lookup: {
        from: "saved_charts",
        let: { savedId: { $toObjectId: "$savedId" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$savedId"],
              },
              isDeleted: false,
            },
          },
        ],
        as: "savedData",
      },
    },
  ]);

  return charts;
};

const retrieveSharedTweets = async (req, res) => {
  const { email } = req.user;
  const tweets = await sharedSchema.aggregate([
    {
      $match: {
        sharedTo: email,
        contentType: "tweet",
        isDeleted: false,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $lookup: {
        from: "saved_tweets",
        let: { savedId: { $toObjectId: "$savedId" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$savedId"],
              },
              isDeleted: false,
            },
          },
        ],
        as: "savedData",
      },
    },
  ]);
  return tweets;
};

const retrieveSharedChartsBy = async (req, res) => {
  const { userID } = req.body;
  const charts = await sharedSchema.find({
    sharedBy: userID,
    contentType: "Charts",
    isDeleted: false,
  });
  if (charts) {
    res.status(200).json({ msg: "Retrival Sucessful", data: charts });
  } else {
    res.status(404).json({ msg: "No Charts available" });
  }
};

const retrieveSharedTweetsBy = async (req, res) => {
  const { userID } = req.body;
  const tweets = await sharedSchema.find({
    sharedBy: userID,
    contentType: "Tweets",
    isDeleted: false,
  });
  if (tweets) {
    res.status(200).json({ msg: "Retrival Sucessful", data: tweets });
  } else {
    res.status(404).json({ msg: "No Tweets available" });
  }
};

const unShareContent = async (req, res) => {
  //check if chart has been saved savedChart()
  //if savedChart true then check if chart has been shared in shared table
  //if shared then set isDeleted as current date
  const { userID, sharedID, sharedTo } = req.body;
  if (userID && sharedID) {
    const shared = await sharedSchema.findOne({
      _id: sharedID,
      sharedBy: userID,
      sharedTo: sharedTo,
      isDeleted: false,
    });
    if (shared) {
      appendData = await sharedSchema.findOneAndUpdate(
        { _id: sharedID },
        { isDeleted: true }
      );
    }
  }
};

module.exports = {
  shareContent,
  retrieveSharedCharts,
  retrieveSharedTweets,
  unShareContent,
  retrieveSharedTweetsBy,
  retrieveSharedChartsBy,
  retrieveAllSharedContent,
};
