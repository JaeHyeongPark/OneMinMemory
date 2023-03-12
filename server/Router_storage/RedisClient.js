const Redis = require("redis");
const dotenv = require("dotenv");
// Redis 연결
dotenv.config();
const client = Redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  socket: {
    reconnectStrategy() {
      console.log("reconnectStrategy", new Date().toJSON());
      return 5000;
    },
  },
  legacyMode: true,
})
  .on("ready", () => console.log("Redis ready 완료~~!"))
  .on("connect", () => console.log("Redis connect 완료~~!"))
  .on("error", (err) => {
    console.error(err);
    console.log("RedisClient error!!!!!");
  });
try {
  client.connect().then();
} catch (err) {
  console.log(err);
}
const redis = client;
module.exports = redis;
