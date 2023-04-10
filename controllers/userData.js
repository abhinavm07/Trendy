const { TwitterApi } = require("twitter-api-v2");
require("dotenv/config");

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_KEY_SECRET;
const apiTokenkey = process.env.API_TOKEN;
const apiTokenSecret = process.env.API_TOKEN_SECRET;

const aposToLexForm = require("apos-to-lex-form");
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require("natural");
const SpellCorrector = require("spelling-corrector");
const stopword = require("stopword");

const tokenizer = new WordTokenizer();
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

const client = new TwitterApi(`${process.env.BEARER_KEY}`);

const getTwtData = async (req, res) => {
  const { twtUsername } = req.body;
  let tweetsColec = [];
  let twtObj = {};
  let twtRes = {};
  const user = await client.v2.userByUsername(twtUsername, {
    "user.fields": "public_metrics",
  });
  const userId = user?.data?.id || null;
  if (userId) {
    //const userFollowers = await client.v2.followers(`${userId}`);
    // const userFollowing = await client.v2.following(`${userId}`);
    const userTweets = await client.v2.userTimeline(`${userId}`, {
      exclude: "retweets,replies",
    });
    if (userTweets) {
      let twtData = userTweets["_realData"]["data"];
      for (const twt of twtData) {
        const twtSentiment = await tweetsSentiment(twt["text"]);
        tweetsColec.push({
          id: twt["id:"],
          tweet: twt["text"],
          sentiment: twtSentiment,
        });
      }
      console.log(tweetsColec);
      return res.status(200).json({ userData: user, twtData: tweetsColec });
    }
    return res
      .status(404)
      .send(
        "User account is not public, please search for a user with public tweets."
      );
  }
  return res.status(404).send("User not found with the given username.");
};

const searchTwt = async (req, res) => {
  let i = 0;
  let tweetColec = [];
  const { search } = req.body;
  const recentTweets = await client.v2.tweetCountRecent(search);

  const searchTweets = await client.v2.search(search, {
    "media.fields": "url",
  });

  // Consume every possible tweet of jsTweets (until rate limit is hit)
  for await (const tweet of searchTweets) {
    i++;
    if (i < 20) {
      tweetColec.push([tweet.id, tweet.text]);
    } else if (i >= 20) {
      console.log(i);
      break;
    }
  }
  console.log(i);
  tweetColec.push([`recent tweet count : ${recentTweets.data[0].tweet_count}`]);
  res.json(tweetColec);
};

const tweetsSentiment = async (data) => {
  const sentiment = getSentiment(data);

  let sentimentRemark;

  if (sentiment === 1) {
    sentimentRemark = "Positive";
    // console.log("Positive");
    return "Positive";
  }

  if (sentiment === 0) {
    sentimentRemark = "Neutral";
    // console.log("Neutral");
    return "Neutral";
  }

  if (sentiment === -1) {
    sentimentRemark = "Negative";
    // console.log("Negative");
    return "Negative";
  }
};

const getSentiment = (data) => {
  if (!data.trim()) {
    return 0;
  }

  const lexed = aposToLexForm(data)
    .toLowerCase()
    .replace(/[^a-zA-Z\s]+/g, "");

  const tokenized = tokenizer.tokenize(lexed);

  const fixedSpelling = tokenized.map((word) => spellCorrector.correct(word));

  const stopWordsRemoved = stopword.removeStopwords(fixedSpelling);

  const analyzed = analyzer.getSentiment(stopWordsRemoved);
  console.log(stopWordsRemoved);
  console.log(analyzed);
  if (analyzed > 0) return 1; // positive
  if (analyzed === 0) return 0;
  if (isNaN(analyzed)) return 0;
  return -1;
};

module.exports = { getTwtData, searchTwt };
