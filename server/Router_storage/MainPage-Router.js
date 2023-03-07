const express = require("express");
const redis = require("./RedisClient");

const router = express.Router();

// 방 넘버 생성
router.get("/roomid", async (req, res, next) => {
  let roomid = "";
  const random = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];
  for (let i = 0; i < 6; i++) {
    const num = Math.floor(Math.random() * 16);
    roomid += random[num];
  }
  // send로 보낼시 클라이언트측에서 타입을 넘버로 오해할수도있다.
  res.json({roomid});
});

// 위에서 생성된 넘버로 실제 방 생성
router.post("/makeroom", async (req, res, next) => {
  const roomid = req.body.id;
  await redis.v4.set(roomid + "/playlistPermissionState", "true")
  await redis.v4.set(roomid + "/renderVoteState", "0")
  await redis.v4.expire(roomid + "/playlistPermissionState", 21600)
  await redis.v4.expire(roomid + "/renderVoteState", 21600)
  res.send("완료");
});

// 해당 방이 정식적으로 존재하는지 확인
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
