const Redis = require("redis");
const dotenv = require("dotenv");

// Redis 연결
dotenv.config();

const client = Redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true,
  pingInterval: 1000, //재형 핑인터벌
});

client.on("connect", () => {
  console.log("Redis 연결~~!");
});
client.on("error", (err) => {
  console.log(err);
  console.log("RedisClient error!!!!!");
});

client.connect();
const redis = client;

module.exports = redis;
