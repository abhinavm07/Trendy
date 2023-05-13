const cleanData = require("../model/cleanData");
let contextsList = [];

const getRecomendations = async (userInput, twtUsername) => {
  const contexts = await cleanData.find({}, null, { limit: 10 });
  for (const element of contexts) {
    contextsList.push(element["contextValue"]);
  }
  const result = recomendations(contextsList, userInput, twtUsername);
  return result;
};

const recomendations = async (items, userInput, twtUsername) => {
  const tf = items.map((item) => {
    const itemTf = new Map();
    item.forEach((term) => {
      if (itemTf.has(term)) {
        itemTf.set(term, itemTf.get(term) + 1);
      } else {
        itemTf.set(term, 1);
      }
    });
    return itemTf;
  });
  //
  const idf = new Map();
  userInput.forEach((term) => {
    let count = 0;
    for (let i = 0; i < items.length; i++) {
      if (tf[i].has(term)) {
        count++;
      }
    }
    idf.set(term, Math.log(items.length / count));
  });

  //

  const tfidf = tf.map((itemTf) => {
    const itemTfidf = new Map();
    itemTf.forEach((count, term) => {
      if (idf.has(term)) {
        itemTfidf.set(term, count * idf.get(term));
      }
    });
    return itemTfidf;
  });
  //

  const similarities = tfidf.map((itemTfidf) => {
    let numerator = 0;
    let itemDenominator = 0;
    let userInputDenominator = 0;
    itemTfidf.forEach((value, term) => {
      userInputDenominator += idf.get(term) ** 2;
      if (userInput.includes(term)) {
        numerator += value * idf.get(term);
      }
      itemDenominator += value ** 2;
    });
    userInputDenominator = Math.sqrt(userInputDenominator);
    itemDenominator = Math.sqrt(itemDenominator);
    const denominator = userInputDenominator * itemDenominator;
    // console.log(itemTfidf, numerator / denominator);
    return numerator / denominator;
  });

  // 3. Compute the TF-IDF of each item in the items array

  const recommendations = items
    .map((item, index) => [item, similarities[index]])
    .filter(([_, similarity]) => !isNaN(similarity))
    .sort(([, similarityA], [, similarityB]) => similarityB - similarityA)
    .map(([item, _]) => item);

  const recomendResult = Array.from(recommendations);
  let similarUsers = [];
  for (const element of recomendResult) {
    const similarDataExists = await cleanData.findOne({
      contextValue: element,
    });
    if (similarDataExists) {
      if (similarDataExists.twitterUser !== twtUsername) {
        if (
          !similarUsers.includes(similarDataExists.twitterUser) &&
          similarUsers.length < 5
        ) {
          similarUsers.push(similarDataExists.twitterUser);
        }
      }
    }
  }
  return similarUsers;
};

module.exports = { getRecomendations };
