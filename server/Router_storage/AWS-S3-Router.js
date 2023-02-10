const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const AWS = require("aws-sdk");

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

// 업로드된 s3 서버에 있는 이미지 전송
router.get("/upload", async (req, res, next) => {
  const params = {
    Bucket: process.env.Bucket_Name,
    // Prefix : `${req.body.roomNumber}/`
    Prefix: "test",
  };
  try {
    const data = await s3.listObjectsV2(params).promise();
    const urlList = [];
    for (const info of data.Contents) {
      urlList.push(
        `https://${process.env.Bucket_Name}.s3.ap-northeast-2.amazonaws.com/` +
          info.Key
      );
    }
    res.send(urlList);
  } catch (err) {
    // 에러 핸들러로 보냄
    return next(err);
  }
});

// 업로드 하려고 받은 이미지 s3에 저장
router.post("/upload", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send(err);
    }
    // const foldername = "roomNumber"
    const foldername = "test/";
    const promises = req.files.map((file, idx) => {
      const params = {
        Bucket: process.env.Bucket_Name,
        Key: foldername + req.body.lastModified[idx],
        ACL: "public-read",
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      return s3.upload(params).promise();
    });
    // promise 작업이 끝나면 이후 작업 처리
    Promise.all(promises)
      .then(() => {
        res.status(200).send("저장완료");
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });
});

module.exports = router;
