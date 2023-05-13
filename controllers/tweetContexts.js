let contextByID = [];
const tweetContext = (tweets, id) => {
  tweets.forEach((element) => {
    if (contextByID[id]) {
      if (!contextByID[id].includes(element["entity"]["name"])) {
        contextByID[id].push(element["entity"]["name"]);
      }
    } else {
      contextByID[id] = [element["entity"]["name"]];
    }
  });
  return contextByID;
};

const calculateVolume = (annots) => {
  let contextVols = {};
  annots.forEach((element) => {
    contextVols[element] = (contextVols[element] || 0) + 1;
  });
  return contextVols;
};

const arrayValue = (contextVolume) => {
  let arrayValue = [];
  const newArray = Object.entries(contextVolume).flatMap(([index, value]) =>
    arrayValue.push(index)
  );
  return arrayValue;
};

module.exports = { tweetContext, calculateVolume, arrayValue };
