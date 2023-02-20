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
    select: false,
    transition: ""
  },
  {
    url: "",
    duration: 5,
    select: false,
    transition: ""
  },
  {
    url: "",
    duration: 15,
    select: false,
    transition: ""
  },
  {
    url: "",
    duration: 15,
    select: false,
    transition: ""
  },
  {
    url: "",
    duration: 5,
    select: false,
    transition: ""
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


// transition효과 playlist에 넣기
router.post("/transition", (req, res, next) => {
  const transition = req.body.transition
  const idx = req.body.idx
  playlist[idx].transition = transition
  res.send(playlist)
})
// 클릭으로 transition 지우기(해당 인덱스만)
router.post("/deltransition", (req, res, next) => {
  const idx = req.body.idx
  playlist[idx].transition = ''
  res.send(playlist)
})

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
    transition: ""
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
