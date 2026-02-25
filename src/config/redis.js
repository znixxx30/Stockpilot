const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://redis:6379"
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

(async () => {
  await redisClient.connect();
  console.log("✅ Redis connected");
})();

module.exports = redisClient;