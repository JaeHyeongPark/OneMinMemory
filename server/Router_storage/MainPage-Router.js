const express = require("express");
const redis = require("./RedisClient");
const uuid = require("uuid");

const router = express.Router();

router.get("/roomid", async (req, res, next) => {
  const roomid = uuid.v4();
  res.send(roomid);
});

router.post("/makeroom", async (req, res, next) => {
    const roomid = req.body.id
    await redis.v4.set(`${roomid}`, "ture")
    res.send("완료")
})

router.post("/check", async (req, res, next) => {
  const check = await redis.v4.get(`${req.body.id}`);
  console.log(req.body.id);
  if (check === null) {
    res.send("No");
  } else {
    res.send("Yes");
  }
});

module.exports = router;
