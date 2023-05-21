const cleanData = require("../model/cleanData");
let contextsList = [];

const getRecomendations = async (userInput, twtUsername) => {
  const contexts = await cleanData.find({}, null, { limit: 10 });
  for (const element of contexts) {
    contextsList.push(element["contextValue"]);
  }
  const result = recommendations(contextsList, userInput, twtUsername);
  return result;
};

const recommendations = async (items, userInput, twtUsername) => {
  const tf = [];
  const idf = {};
  const termsSet = new Set();
  const termCount = {};

  for (const item of items) {
    const itemTf = {};
    for (const term of item) {
      itemTf[term] = (itemTf[term] || 0) + 1;
      termsSet.add(term);
      termCount[term] = (termCount[term] || 0) + 1;
    }
    tf.push(itemTf);
  }

  for (const term of userInput) {
    const count = termCount[term] || 0;
    idf[term] = Math.log(items.length / count);
  }

  const tfidf = tf.map((itemTf) => {
    const itemTfidf = {};
    for (const [term, count] of Object.entries(itemTf)) {
      const termIdf = idf[term];
      if (termIdf) {
        itemTfidf[term] = count * termIdf;
      }
    }
    return itemTfidf;
  });

  const userInputSet = new Set(userInput);
  const similarities = tfidf.map((itemTfidf) => {
    let numerator = 0;
    let itemDenominator = 0;
    let userInputDenominator = 0;
    for (const [term, value] of Object.entries(itemTfidf)) {
      const termIdf = idf[term];
      userInputDenominator += termIdf ** 2;
      if (userInputSet.has(term)) {
        numerator += value * termIdf;
      }
      itemDenominator += value ** 2;
    }
    userInputDenominator = Math.sqrt(userInputDenominator);
    itemDenominator = Math.sqrt(itemDenominator);
    const denominator = userInputDenominator * itemDenominator;
    return numerator / denominator;
  });

  const recommendations = items
    .map((item, index) => [item, similarities[index]])
    .filter(([_, similarity]) => !isNaN(similarity))
    .sort(([, similarityA], [, similarityB]) => similarityB - similarityA)
    .map(([item, _]) => item);

  const similarUsersSet = new Set();
  for (const element of recommendations) {
    const similarDataExists = await cleanData.findOne({
      contextValue: element,
    });
    if (
      similarDataExists &&
      similarDataExists.twitterUser.toLowerCase() !==
        twtUsername.toLowerCase() &&
      similarUsersSet.size < 5
    ) {
      similarUsersSet.add(similarDataExists.twitterUser);
    }
  }
  console.log(Array.from(similarUsersSet));
  return Array.from(similarUsersSet);
};

module.exports = { getRecomendations };
