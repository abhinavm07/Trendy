const cron = require("node-cron");
const { autoTracking } = require("../controllers/autoUserTracker");

const job = cron.schedule("* * * * *", () => {
  console.log("Running cron job auto_tracking.js");
  if (process.argv.length < 3) {
    console.log("Please provide a username");
    process.exit(1);
  }
  const user = process.argv[2];
  autoTracking(user)
    .then((r) => console.log(r))
    .catch((e) => {
      throw new Error(e);
    });
});

job.on("error", (err) => {
  console.error("Cron job error:", err);
});

job.start();
