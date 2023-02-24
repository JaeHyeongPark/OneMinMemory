const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const AWS = require("aws-sdk");
const redis = require("./RedisClient");

const router = express.Router();

dotenv.config();
AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.Access_key_ID,
  secretAccessKey: process.env.Secret_access_key,
});

const s3 = new AWS.S3();

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, "");
  },
});
const upload = multer({ storage: storage }).array("images");

module.exports = function (io) {
  // 현재 해당 방에대한 정보를 처음에 싹 보내줌(새로 들어온 사람이나 새로고침)
  router.post("/sendimage", async (req, res, next) => {
    const roomid = req.body.roomid;

    const roomorigin = await redis.v4.lRange(`${roomid}/origin`, 0, -1);
    const roomeffect = await redis.v4.lRange(`${roomid}/effect`, 0, -1);
    let roomplaylist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
    let roomplaysong = JSON.parse(await redis.v4.get(`${roomid}/song`));
    if (roomplaylist === null) roomplaylist = [];
    if (roomplaysong === null) roomplaysong = [0, ""];

    res.json({
      origin: roomorigin,
      effect: roomeffect,
      playlist: roomplaylist,
      playsong: roomplaysong,
    });
  });

  // 업로드 하려고 받은 이미지 s3에 저장
  router.post("/upload", async (req, res, next) => {
    const upimg = [];
    upload(req, res, (err) => {
      if (err) {
        res.status(400).send(err);
      }
      const roomid = req.body.roomid;

      // const foldername = "roomNumber"
      const foldername = `${roomid}/Original/`;
      const promises = req.files.map((file, idx) => {
        let fileKey = "";
        if (typeof req.body.lastModified === "string") {
          fileKey = req.body.lastModified;
        } else {
          fileKey = req.body.lastModified[idx];
        }
        const key = foldername + fileKey;
        const params = {
          Bucket: process.env.Bucket_Name,
          Key: key,
          ACL: "public-read",
          Body: file.buffer,
          ContentType: file.mimetype,
          CacheControl: "no-store",
        };
        upimg.push(
          `https://${process.env.Bucket_Name}.s3.ap-northeast-2.amazonaws.com/` +
            key
        );
        return s3.upload(params).promise();
      });
      // promise 작업이 끝나면 이후 작업 처리
      Promise.all(promises)
        .then(async () => {
          upimg.forEach(async (url) => {
            await redis.v4.rPush(`${roomid}/origin`, url);
          });
          res.status(200).send({ success: true });
          io.to(roomid).emit("upload", { upimg });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    });
  });
  return router;
};
