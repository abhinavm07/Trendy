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

const contextVol = (annots) => {
  let contextVols = {};
  annots.forEach((element) => {
    contextVols[element] = (contextVols[element] || 0) + 1;
  });
  return contextVols;
};

module.exports = { tweetContext, contextVol };
