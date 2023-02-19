const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const { spawn } = require("child_process");
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

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
// 이거 여기 있어야하나?? playlist context로 이동예정
let playlist = [
  {
    url: "",
    duration: 5,
    // fadeout: null,
    // transition: null,
  },
  {
    url: "",
    duration: 5,
    // fadeout: null,
    // transition: null,
  },
  {
    url: "",
    duration: 5,
    // fadeout: null,
    // transition: null,
  },
  {
    url: "",
    duration: 5,
    // fadeout: null,
    // transition: null,
  },
  {
    url: "",
    duration: 5,
    // fadeout: null,
    // transition: null,
  },
  {
    url: "",
    duration: 5,
    // fadeout: null,
    // transition: null,
  },
];

function imageToVideos(imagePath, durations) {
  return new Promise((resolve, reject) => {
    let videos = [];

    for (let i = 0; i < imagePath.length; i++) {
      const videoPath = `./Router_storage/input/source${i}.mp4`;
      ffmpeg(imagePath[i])
        .loop(durations[i])
        .on("start", function (commandLine) {
          console.log("Spawned Ffmpeg with command: " + commandLine);
        })
        .on("error", function (err) {
          console.log("An error occurred: " + err.message);
          reject(err);
        })
        .on("end", function () {
          console.log(`Processing ${videoPath} finished !`);
          videos[i] = videoPath;
          if (
            videos.filter(
              (element) =>
                element !== undefined && element !== null && element !== ""
            ).length === imagePath.length
          ) {
            resolve(videos);
          }
        })
        .save(videoPath);
    }
  });
}

function mergeTransitions(inputPath, transitions) {
  return new Promise((resolve, reject) => {
    let transedVideos = [];

    for (let i = 0; i < inputPath.length - 1; i++) {
      const transedPath = `./Router_storage/input/transed${i}.mp4`;
      ffmpeg()
        .addInput(inputPath[i])
        .addInput(inputPath[i + 1])
        .outputOptions(transitions[i])
        .on("start", function (commandLine) {
          console.log("Spawned Ffmpeg with command: " + commandLine);
        })
        .on("error", function (err) {
          console.log("An error occurred: " + err.message);
          reject(err);
        })
        .on("end", function () {
          console.log(`Processing ${transedPath} finished !`);
          transedVideos[i] = transedPath;
          if (
            transedVideos.filter(
              (element) =>
                element !== undefined && element !== null && element !== ""
            ).length ===
            inputPath.length - 1
          ) {
            resolve(transedVideos);
          }
        })
        .save(transedPath);
    }
  });
}

function mergeAll(inputPath) {
  return new Promise((resolve, reject) => {
    const mergedVideo = "./Router_storage/output/merged.mp4";
    const mergeVideos = ffmpeg();
    const transedVideos = inputPath;
    transedVideos.forEach((effectVideo) => {
      mergeVideos.addInput(effectVideo);
    });

    mergeVideos
      .on("start", function (commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
        reject(err);
      })
      .on("end", function () {
        console.log(`Processing ${mergedVideo} finished !`);
        resolve(mergedVideo);
      })
      .mergeToFile(
        "./Router_storage/output/merged.mp4",
        "./Router_storage/temp"
      );
  });
}

function addAudio(inputPath) {
  return new Promise((resolve, reject) => {
    // Use ffprobe to get input duration
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      inputPath,
    ]);

    let inputDuration;
    ffprobe.stdout.on("data", (data) => {
      inputDuration = parseFloat(data);
    });

    ffprobe.on("close", (code) => {
      if (code !== 0) {
        reject(`ffprobe exited with code ${code}`);
      } else {
        console.log(`Input duration: ${inputDuration}`);
        // Use inputDuration in your ffmpeg command
        const finishedVideo = `./Router_storage/output/oneminute_${Date.now()}.mp4`;
        ffmpeg(inputPath)
          .videoCodec("libx264")
          .audioCodec("libmp3lame")
          .size("1080x720")
          .addInput(
            "./Hoang - Run Back to You (Official Lyric Video) feat. Alisa_128kbps.mp3"
          )
          .duration(inputDuration)
          .audioFilter(`afade=t=out:st=${inputDuration - 5}:d=5`)
          .on("start", function (commandLine) {
            console.log("Spawned Ffmpeg with command: " + commandLine);
          })
          .on("error", function (err) {
            console.log("An error occurred: " + err.message);
            reject(err);
          })
          .on("end", function () {
            console.log(`Processing ${finishedVideo} finished !`);
            resolve(finishedVideo);
          })
          .save(finishedVideo);
      }
    });
  });
}

router.post("/merge", async (req, res, next) => {
  // console.log(req.body.playlist);
  // console.log(req.body.translist);
  const images = req.body.playlist.map(({ url }) => url);
  const durations = req.body.playlist.map(({ duration }) => duration);
  const transitions = req.body.translist.map(({ transition }) => transition);
  console.log("동영상 생성을 시작합니다~~~~!!");
  const videoPaths = await imageToVideos(images, durations);
  console.log("이미지를 비디오로 변환 완료, 변환된 비디오:", videoPaths);
  const transedPaths = await mergeTransitions(videoPaths, transitions);
  console.log("트랜지션 비디오로 변환 완료, 변환된 비디오:", transedPaths);
  const mergedPath = await mergeAll(transedPaths);
  console.log("비디오 병합 완료, 변환된 비디오:", mergedPath);
  const finishedPath = await addAudio(mergedPath);
  console.log("오디오 삽입 및 최종 렌더링 완료, 완료된 비디오:", finishedPath);
  res.download(finishedPath);
});

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
  // playlist[idx].fadeout = true;
  // playlist[idx].transition = "";
  res.send(playlist);
});

module.exports = router;
