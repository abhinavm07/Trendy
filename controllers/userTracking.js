const trackingSchema = require("../model/trackUserSchema");
const {calculateVolume} = require("../controllers/tweetContexts");
const {MAX_TRACKING = 10} = process.env;

const userTracking = async (req, res) => {
    const {userData: user, twtData: tweetsColec} = req.body;
    const sysUsername = req.user.email;
    let userAnnotes = [];
    let userData;
    let UserDataExists;

    const countOldRecords = await trackingSchema.find({
        trackedBy: sysUsername,
    });

    if (countOldRecords.length >= MAX_TRACKING) {
        return res.status(400).json({
            status: "error",
            msg: `You can only track ${MAX_TRACKING} users.`,
        });
    }


    UserDataExists = await trackingSchema.findOne({
        trackedBy: sysUsername,
        trackedUser: user["data"]["username"],
    });

    const appendStatus = await trackingSchema.findOneAndUpdate(
        {
            trackedBy: sysUsername,
            trackedUser: user["data"]["username"],
        },
        {trackingStatus: true}
    );

    if (UserDataExists) {
        userData = await UserDataExists.twtData;
        tweetsColec.forEach((element) => {
            if (!JSON.stringify(userData).includes(JSON.stringify(element))) {
                userData.push(element);
            }
        });

        await UserDataExists.save();

    } else if (!UserDataExists) {
        trackUserData = await trackingSchema.create({
            trackedUser: user["data"]["username"],
            trackedBy: sysUsername,
            twtData: tweetsColec,
            userData: user,
            trackingStatus: true,
        });
    }

    UserDataExists = await trackingSchema.findOne({
        trackedBy: sysUsername,
        trackedUser: user["data"]["username"],
        trackingStatus: true,
    });
    userData = await UserDataExists.twtData;

    userData.forEach((element) => {
        if (element["context"]) {
            userAnnotes.push(element["context"]);
        }
    });
    const contextVolume = calculateVolume(userAnnotes.flat());
    await trackingSchema.findOneAndUpdate(
        {
            trackedBy: sysUsername,
            trackedUser: user["data"]["username"],
            trackingStatus: true,
        },
        {contextVolume: contextVolume}
    );

    res.status(200).json({status: 'success', msg: 'You are now tracking this user.', data: UserDataExists});
};

const retriveTrackedUserData = async (req, res) => {
    const trackedDataExists = await trackingSchema.find({
        trackedBy: req.user.email,
    });
    if (trackedDataExists) {
        return res
            .status(200)
            .json(trackedDataExists);
    }
    return res.status(404).json({msg: "Sorry! No such data found"});
};

/**
 * is the users being tracked bu current user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const isUserTracked = async (trackedUser, trackedBy) => {
    const trackedDataExists = await trackingSchema.findOne({
        trackedBy,
        trackedUser,
    });
    if (trackedDataExists) {
        return true;
    }
    return false;
}

const suspendTracking = async (req, res) => {
    const {trackedUser, userID} = req.body;
    const trackedDataExists = await trackingSchema.findOne({
        trackedBy: userID,
        trackedUser: trackedUser,
    });
    if (trackedDataExists) {
        if (trackedDataExists["trackingStatus"] === false) {
            return res.status(400).json({
                msg: `Tracked Data with the ID of : ${JSON.stringify(
                    trackedDataExists["_id"]
                )} has already been deleted !`,
            });
            // throw new Error("Tweet has already been deleted");
        }
        const delTrackedData = await trackingSchema.findOneAndUpdate(
            {
                trackedBy: userID,
                trackedUser: trackedUser,
            },
            {trackingStatus: false}
        );
        return res.status(200).json({
            msg: `Tracked Data with the ID of : ${JSON.stringify(
                trackedDataExists["_id"]
            )} has been deleted !`,
        });
    }
    return res.status(404).json({
        msg: `Tracked Data not found`,
    });
};

const changeTrackStatus = async (req, res) => {
    const {_id, trackedBy, trackingStatus} = req.body;

    if (_id) {
        await trackingSchema.findOneAndUpdate({
            _id: _id,
            trackedBy
        }, {trackingStatus: !trackingStatus});
        res.status(200).json({
            msg: `Tracking status changed`,
            status: 'success'
        });
    } else {
        res.status(404).json({
            msg: `Tracked Data not found`,
            status: 'error'
        });
    }
};

module.exports = {
    userTracking,
    retriveTrackedUserData,
    suspendTracking,
    changeTrackStatus,
    isUserTracked
};
