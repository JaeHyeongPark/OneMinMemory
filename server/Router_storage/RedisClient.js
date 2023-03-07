const Redis = require("redis");
const dotenv = require("dotenv");

// Redis 연결
dotenv.config();

const client = Redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true,
});

client.on("connect", () => {
  console.log("Redis 연결~~!");
});
client.on("error", (err) => {
  console.log(err);
});

client.connect();
const redis = client;

module.exports = redis;
