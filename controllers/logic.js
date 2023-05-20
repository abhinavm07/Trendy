const aposToLexForm = require("apos-to-lex-form");
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require("natural");
const SpellCorrector = require("spelling-corrector");
const stopword = require("stopword");

const tokenizer = new WordTokenizer();
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

const emotion = (req, res) => {
  const { data } = req.body;

  console.log("Hello");

  const sentiment = getSentiment(data);

  if (sentiment === 1) {
    return res.status(200).json({ Sentiment: "Positive" });
  }

  if (sentiment === 0) {
    return res.status(200).json({ Sentiment: "Neutral" });
  }

  if (sentiment === -1) {
    return res.status(200).json({ Sentiment: "Negative" });
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

module.exports = {
  emotion,
};
