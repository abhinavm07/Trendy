const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

function clearCache() {
  const cacheFolder = path.resolve("./cache");
  if (fs.existsSync(cacheFolder)) {
    //delete all the content of the cache folder
    fs.readdir(cacheFolder, (err, files) => {
      if (err) throw err;
      console.log("Clearing cache folder");
      for (const file of files) {
        fs.unlink(path.join(cacheFolder, file), (err) => {
          if (err) throw err;
        });
      }
    });
  }
}

//use node-cron to schedule this function to run every saturday
cron.schedule("0 0 * * SAT", () => {
  console.log("Clearing cache as its saturday");
  clearCache();
});
