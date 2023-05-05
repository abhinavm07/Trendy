// const { TwitterApi } = require("twitter-api-v2");
// require("dotenv/config");
// const cron = require("node-cron");
// const trackingSchema = require("../model/trackUserSchema");
// const client = new TwitterApi(`${process.env.BEARER_KEY}`);
// let trackedID = [];

// const { tweetsSentiment } = require("./sentimentAnalysis");

// const { tweetContext, contextVol } = require("./tweetContexts");

// const { userTracking } = require("../controllers/userTracking");

// const logger = async () => {
//   let tweetsColec = [];
//   let userAnnotes = [];
//   const getID = await idList();

//   for (const trackID of getID) {
//     console.log(trackID);

//     const retriveData = await trackingSchema.findById({
//       _id: trackID,
//     });
//     let twtUsername = retriveData["trackedUser"];

//     // let user = await client.v2.userByUsername(`${twtUsername}`, {
//     //   "user.fields": "public_metrics",
//     // });
//     const userId = user?.data?.id || null;
//     if (userId) {
//       userTweets = await client.v2.userTimeline(`${userId}`, {
//         exclude: "retweets,replies",
//         "tweet.fields": "context_annotations",
//       });
//       if (userTweets) {
//         let twtData = userTweets["_realData"]["data"];
//         for (const twt of twtData) {
//           const id = twt["id"];
//           const twtSentiment = await tweetsSentiment(twt["text"]);
//           const annotations = twt["context_annotations"];
//           if (annotations) {
//             const context = tweetContext(annotations, id);
//             userAnnotes.push(context[id]);
//             tweetsColec.push({
//               id: twt["id"],
//               tweet: twt["text"],
//               sentiment: twtSentiment,
//               context: context[id],
//             });
//           } else {
//             tweetsColec.push({
//               id: twt["id"],
//               tweet: twt["text"],
//               sentiment: twtSentiment,
//             });
//           }
//         }
//         console.log(trackID);
//         userTracking(user, retriveData["trackedBy"], tweetsColec, trackID);
//       }
//       console.log(
//         "User account is not public, please search for a user with public tweets."
//       );
//     }
//     console.log("User not found with the given username.");
//   }
// };

// const idList = async () => {
//   const trackedData = await trackingSchema.find({});
//   trackedData.forEach((element) => {
//     const objID = JSON.stringify(element["_id"]).replace(/['"]+/g, "");
//     if (!trackedID.includes(objID)) {
//       trackedID.push(objID);
//     }
//   });
//   return trackedID;
// };

// const scheduler = cron.schedule("* * * * *", logger);

// module.exports = { scheduler, logger };
