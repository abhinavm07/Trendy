const Twitter = require("twitter");
require("dotenv/config");

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_KEY_SECRET;
const apiTokenkey = process.env.API_TOKEN;
const apiTokenSecret = process.env.API_TOKEN_SECRET;

const client = new Twitter({
  consumer_key: apiKey,
  consumer_secret: apiSecret,
  access_token_key: apiTokenkey,
  access_token_secret: apiTokenSecret,
});

const getTwtData = async (req, res) => {
  const { twtuser } = req.body;
  console.log(twtuser);
  const params = { screen_name: twtuser };
  client.get(
    "statuses/user_timeline",
    params,
    function (error, tweets, response) {
      if (!error) {
        const data = { data: tweets, hits: tweets.length };
        console.log(data);
      }
    }
  );

  res.send("Hello");
};

module.exports = { getTwtData };
