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
  const s3filename = req.body.originurl.split("testroom/Effect/")[1];
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

router.post("/merge", async (req, res, next) => {
  console.log(req.body);
  const images = Object.keys(req.body.urlList);
  console.log("동영상 생성을 시작합니다~~~~!!");
  var videoOptions = {
    loop: 3,
    fps: 25,
    transition: true,
    transitionDuration: 1, // seconds
    videoBitrate: 3000,
    videoCodec: "libx264",
    size: "1080x?",
    audioBitrate: "128k",
    audioChannels: 2,
    format: "mp4",
    pixelFormat: "yuv420p",
  };

  videoShow(images, videoOptions)
    .audio(
      "Hoang - Run Back to You (Official Lyric Video) feat. Alisa_128kbps.mp3"
    )
    .save("Output.mp4")
    .on("start", function (command) {
      console.log("Conversion started" + command);
    })
    .on("error", function (err, stdout, stderr) {
      console.log("Some error occured" + err);
    })
    .on("end", function (output) {
      console.log("Conversion completed" + output);
      res.download("Output.mp4");
    });
  console.log("Conversion completed 2222");
});

// react 재생목록에 보낼 임시정보 Array
let playlist = [
  {
    url: "",
    duration: 5,
    select: false,
  },
  {
    url: "",
    duration: 5,
    select: false,
  },
  {
    url: "",
    duration: 15,
    select: false,
  },
  {
    url: "",
    duration: 15,
    select: false,
  },
  {
    url: "",
    duration: 5,
    select: false,
  },
];
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

// 삭제 이벤트 해당 객체 삭제
router.post("/deleteplayurl", (req, res, next) => {
  const idx = req.body.idx;
  playlist = playlist.filter((data, i) => {
    if (idx !== i) {
      return data;
    }
  });
  res.send(playlist);
});

// 재생목록 click시 이벤트
router.post("/clickimg", (req, res, next) => {
  const idx = req.body.idx;
  const url = playlist[idx].url;

  let check = false;
  let time = playlist[idx].duration;
  let totaltime = 0;
  playlist.forEach((data, i) => {
    if (i !== idx && data.select === true) {
      // 0번째 일때 0과 false가 겹쳐서 의도와 다른 결과가 나옴
      check = String(i)
    }
    if (i < idx) {
      time += playlist[i].duration;
    }
    totaltime += data.duration;
  });

  if (check) {
    check = Number(check)
    playlist[idx].url = playlist[check].url;
    playlist[check].url = url;
    playlist[idx].select = false;
    playlist[check].select = false;
    res.json({ playlist });
  } else if (playlist[idx].select) {
    playlist[idx].select = false;
    res.json({ playlist });
  } else {
    playlist[idx].select = true;
    res.json({
      playlist,
      time: time,
      duration: playlist[idx].duration,
      totaltime: totaltime,
    });
  }
});
// 새로운 사진을 재생목록에 추가(프리셋 말고)
router.post("/inputnewplay", (req, res, next) => {
  const url = req.body.url;
  playlist.push({
    url: url,
    duration: 5,
    select: false,
  });
  res.send(playlist);
});
// 이미지 재생 시간 변경
router.post("/changetime", (req, res, next) => {
  const idx = req.body.idx;
  const time = req.body.time
  playlist[idx].select = false
  playlist[idx].duration += time;

  res.json({playlist,DT:playlist[idx].duration});
});


module.exports = router;
