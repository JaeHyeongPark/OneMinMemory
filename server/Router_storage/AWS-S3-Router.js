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

const Original = {};
const Effect = {};

// 업로드된 s3 서버에 있는 Original 이미지 전송
router.post("/sendimage", async (req, res, next) => {
  const filename = req.body.filename;
  const params = {
    Bucket: process.env.Bucket_Name,
    // Prefix : `${req.body.roomNumber}/`
    Prefix: `testroom/${filename}/`,
  };
  try {
    const data = await s3.listObjectsV2(params).promise();
    for (const info of data.Contents) {
      const url =
        `https://${process.env.Bucket_Name}.s3.ap-northeast-2.amazonaws.com/` +
        info.Key;
      if (filename === "Original") {
        if (url in Original) {
          continue;
        } else {
          Original[url] = 0;
        }
      } else {
        if (url in Effect) {
          continue;
        } else {
          Effect[url] = 0;
        }
      }
    }
    if (filename === "Original") {
      res.send(Original);
    } else {
      res.send(Effect);
    }
  } catch (err) {
    // 에러 핸들러로 보냄
    return next(err);
  }
});

// 클릭 이벤트 발생시
router.post("/clickimage", (req, res, next) => {
  const url = req.body.url;
  const mode = req.body.mode;
  if (mode === "Original") {
    Original[url] = Original[url] ? 0 : 1;
    res.send(Original);
  } else {
    Effect[url] = Effect[url] ? 0 : 1;
    res.send(Effect);
  }
});

// 선택된 이미지 삭제
router.post("/deleteimage", async (req, res, next) => {
  const mode = req.body.mode;
  const selectimg = [];

  if (mode === "Original") {
    Object.keys(Original).forEach((url) => {
      if (Original[url] === 1) {
        selectimg.push(url);
        delete Original[url];
      }
    });
  } else {
    Object.keys(Effect).forEach((url) => {
      if (Effect[url] === 1) {
        selectimg.push(url);
        delete Effect[url];
      }
    });
  }

  try{
    for await (let s3url of selectimg) {
      const s3key = s3url.split("com/");
      await s3.deleteObject({
        Bucket: process.env.Bucket_Name,
        Key: s3key[1],
      }).promise();
    }
    if (mode === "Original") {
      res.send(Original);
    } else {
      res.send(Effect);
    }
  }catch(err){
    return next(err)
  }
});

// 업로드 하려고 받은 이미지 s3에 저장
router.post("/upload", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send(err);
    }
    // const foldername = "roomNumber"
    const foldername = "testroom/Original/";
    const promises = req.files.map((file, idx) => {
      let fileKey = "";
      if (typeof req.body.lastModified === "string") {
        fileKey = req.body.lastModified;
      } else {
        fileKey = req.body.lastModified[idx];
      }

      const params = {
        Bucket: process.env.Bucket_Name,
        Key: foldername + fileKey,
        ACL: "public-read",
        Body: file.buffer,
        ContentType: file.mimetype,
        CacheControl: "no-store",
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
