const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const axios = require("axios");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
var videoShow = require("videoshow");
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.Access_key_ID,
  secretAccessKey: process.env.Secret_access_key,
});

const s3 = new AWS.S3();

const router = express.Router();
const upload = multer();
dotenv.config();

router.post("/addtoplay", upload.none(), async (req, res, next) => {
  const imageurl = req.body.imagedata.split("base64,")[1];
  const s3filename = req.body.originurl.split("testroom/Effectroom/Effect/")[1];
  const imgbuffer = Buffer.from(imageurl, "base64");
  const image = sharp(imgbuffer);
  const imgMeta = await image.metadata();
  const params = {
    Bucket: process.env.Bucket_Name,
    Key: "toplay/Effect" + s3filename,
    ACL: "public-read",
    Body: imgbuffer,
    ContentType: "image/" + imgMeta.format,
    CacheControl: "no-store",
  };
  s3.putObject(params)
    .promise()
    .then(() => {
      const addedUrl =
        `https://${process.env.Bucket_Name}.s3.ap-northeast-2.amazonaws.com/` +
        params.Key;
      res.send(addedUrl);
    });
});

const toPlayUrlList = {};
router.get("/playlist", async (req, res, next) => {
  const params = {
    Bucket: process.env.Bucket_Name,
    // Prefix : `${req.body.roomNumber}/`
    Prefix: "toplay",
  };
  try {
    const data = await s3.listObjectsV2(params).promise();
    for (const info of data.Contents) {
      const url =
        `https://${process.env.Bucket_Name}.s3.ap-northeast-2.amazonaws.com/` +
        info.Key;
      if (url in toPlayUrlList) {
        continue;
      } else {
        toPlayUrlList[url] = 0;
      }
    }
    res.send(toPlayUrlList);
  } catch (err) {
    // 에러 핸들러로 보냄
    return next(err);
  }
});

// react 재생목록에 보낼 임시정보 Array
let playlist = [
  {
    url: "",
    duration: 5,
    fadeout: true,
    transition: "effect1",
  },
  {
    url: "",
    duration: 5,
    fadeout: true,
    transition: "effect2",
  },
  {
    url: "",
    duration: 15,
    fadeout: true,
    transition: "effect2",
  },
  {
    url: "",
    duration: 15,
    fadeout: true,
    transition: "effect1",
  },
  {
    url: "",
    duration: 5,
    fadeout: true,
    transition: null,
  },
];

// router.post("/merge", async (req, res, next) => {
//   console.log(req.body);
//   const images = Object.keys(req.body.urlList);
//   console.log("동영상 생성을 시작합니다~~~~!!");
//   var videoOptions = {
//     loop: 3,
//     fps: 25,
//     transition: true,
//     transitionDuration: 1, // seconds
//     videoBitrate: 3000,
//     videoCodec: "libx264",
//     size: "1080x?",
//     audioBitrate: "128k",
//     audioChannels: 2,
//     format: "mp4",
//     pixelFormat: "yuv420p",
//   };

//   videoShow(images, videoOptions)
//     .audio(
//       "Hoang - Run Back to You (Official Lyric Video) feat. Alisa_128kbps.mp3"
//     )
//     .save("Output.mp4")
//     .on("start", function (command) {
//       console.log("Conversion started" + command);
//     })
//     .on("error", function (err, stdout, stderr) {
//       console.log("Some error occured" + err);
//     })
//     .on("end", function (output) {
//       console.log("Conversion completed" + output);
//       res.download("Output.mp4");
//     });
//   console.log("Conversion completed 2222");
// });

// 재생목록 호출 API
router.get("/getplaylist", async (req, res, next) => {
  res.json({ results: playlist });
});

router.post("/postplaylist", (req, res, next) => {
  const url = req.body.url;
  const idx = req.body.idx;
  playlist[idx].url = url;
  res.send(playlist);
});

router.post("/deleteplayurl", (req, res, next) => {
  const idx = req.body.idx;
  playlist[idx].url = "";
  playlist[idx].fadeout = true;
  playlist[idx].transition = "";
  res.send(playlist);
});

module.exports = router;
