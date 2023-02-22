const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const redis = require("./RedisClient");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const { spawn } = require("child_process");
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);
const fs = require("fs");

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

const effectFilters = {
  zoom_in: [
    "-filter_complex",
    "scale=12800x7200,zoompan=z=pzoom+0.0025:x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1280x720:fps=30",
  ],
  // zoom_out: [
  //   "-filter_complex",
  //   "zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0023))':x='max(1,iw/2-(iw/zoom/2))':y='max(1,ih/2-(ih/zoom/2))':d=300:s=hd1080",
  // ],
  zoom_top_left: [
    "-filter_complex",
    "scale=12800x7200,zoompan=z=pzoom+0.0015:d=1:s=1280x720:fps=30",
  ],
  zoom_top_right: [
    "-filter_complex",
    "scale=12800x7200,zoompan=z=pzoom+0.0015:x='iw/2+iw/zoom/2':y=y:d=1:s=1280x720:fps=30",
  ],
  zoom_bottom_left: [
    "-filter_complex",
    "scale=12800x7200,zoompan=z=pzoom+0.0015:y=7200:d=1:s=1280x720:fps=30",
  ],
  zoom_bottom_right: [
    "-filter_complex",
    "scale=12800x7200,zoompan=z=pzoom+0.0015:x='iw/2+iw/zoom/2':y=7200:d=1:s=1280x720:fps=30",
  ],
};

function getImages(inputPath) {
  return new Promise((resolve, reject) => {
    const promises = [];

    for (let i = 0; i < inputPath.length; i++) {
      const imageKey = inputPath[i].split("com/")[1];

      const s3Params = {
        Bucket: process.env.Bucket_Name,
        Key: imageKey,
      };
      const imageStream = s3.getObject(s3Params).createReadStream();
      const localFilePath = `./Router_storage/input/image${i}.jpg`;
      const localFileStream = fs.createWriteStream(localFilePath);
      const promise = new Promise((resolve, reject) => {
        localFileStream.on("finish", () => resolve(localFilePath));
      });
      promises.push(promise);
      imageStream.pipe(localFileStream);
    }

    Promise.all(promises)
      .then((images) => resolve(images))
      .catch((err) => reject(err));
  });
}

function addEffects(inputPath, durations, effects) {
  return new Promise((resolve, reject) => {
    let effectedVideos = [];
    let cnt = 0;

    for (let i = 0; i < inputPath.length; i++) {
      const effectedPath = `./Router_storage/input/effects${i}.mp4`;
      effects[i] = effectFilters[effects[i]];
      ffmpeg(inputPath[i])
        .loop(durations[i])
        .outputOptions(effects[i])
        .on("start", function (commandLine) {
          console.log("Spawned Ffmpeg with command: " + commandLine);
        })
        .on("error", function (err) {
          console.log("An error occurred: " + err.message);
          reject(err);
        })
        .on("end", function () {
          console.log(`Processing ${effectedPath} finished !`);
          effectedVideos[i] = effectedPath;
          cnt += 1;
          if (cnt === inputPath.length) {
            resolve(effectedVideos);
          }
        })
        .save(effectedPath);
    }
  });
}

function ffmpegSyncTrans(
  prev_video,
  input,
  transition,
  prev_duration,
  transedPath
) {
  console.log("ffmpegSyncTrans 함수 호출");
  return new Promise((resolve, reject) => {
    ffmpeg()
      .addInput(prev_video)
      .addInput(input)
      .outputOption(
        "-filter_complex",
        `[0:v][1:v]xfade=transition=${transition}:duration=1:offset=${
          prev_duration - 1
        }`
      )
      .on("start", function (commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
        reject(err);
      })
      .save(transedPath)
      .on("end", function () {
        console.log(`Processing transed finished !`);
        resolve();
      });
  });
}

function ffmpegSyncMerge(prev_video, input, transedPath) {
  console.log("ffmpegSyncMerge 함수 호출");
  return new Promise((resolve, reject) => {
    ffmpeg()
      .addInput(prev_video)
      .addInput(input)
      .on("start", function (commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
        reject(err);
      })
      .mergeToFile(transedPath)
      .on("end", function () {
        console.log(`Processing transed finished !`);
        resolve();
      });
  });
}

function mergeTransitions(inputPath, durations, transitions) {
  console.log("mergeTransitions 함수 호출");
  return new Promise(async (resolve, reject) => {
    let prev_duration = durations[0];
    let prev_video = inputPath[0];
    let flag = true;
    for (let i = 1; i < inputPath.length; i++) {
      let transedPath;
      if (flag) {
        transedPath = `./Router_storage/input/transed_A.mp4`;
      } else {
        transedPath = `./Router_storage/input/transed_B.mp4`;
      }
      flag = !flag;
      if (transitions[i - 1]) {
        await ffmpegSyncTrans(
          prev_video,
          inputPath[i],
          transitions[i - 1],
          prev_duration,
          transedPath
        ).then(() => {
          prev_video = transedPath;
          prev_duration = prev_duration + durations[i] - 1;
        });
      } else {
        await ffmpegSyncMerge(prev_video, inputPath[i], transedPath).then(
          () => {
            prev_video = transedPath;
            prev_duration = prev_duration + durations[i];
          }
        );
      }
    }
    resolve(prev_video);
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
          .size("1280x720")
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
  const roomid = req.body.roomid;
  console.log(roomid);
  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
  console.log(playlist);
  const imageUrls = playlist.map(({ url }) => url);
  const durations = playlist.map(({ duration }) => duration);
  const effects = playlist.map(({ effect }) => effect);
  const transitions = playlist.map(({ transition }) => transition);
  // console.log("durations", durations);
  // console.log("URL", images);
  // console.log("effects", effects);
  // console.log("transitions", transitions);
  console.log("이미지 >>>> 동영상(with duration) Rendering...");
  let start = new Date();

  const images = await getImages(imageUrls);
  let end1 = new Date();
  console.log("이미지 다운 완료:", images);
  let result = end1.getTime() - start.getTime();
  console.log("소요시간", result);

  // const videoPaths = await imageToVideos(images, durations);
  // let end1 = new Date();
  // console.log("이미지를 비디오로 변환 완료, 변환된 비디오:", videoPaths);
  // let result = end1.getTime() - start.getTime();
  // console.log("소요시간", result);

  const effectedPaths = await addEffects(images, durations, effects);
  let end2 = new Date();
  console.log("이펙트 비디오로 변환 완료, 변환된 비디오:", effectedPaths);
  result = end2.getTime() - start.getTime();
  console.log("소요시간", result);

  const transedPath = await mergeTransitions(
    effectedPaths,
    durations,
    transitions
  );
  let end3 = new Date();
  console.log("비디오 트랜지션 완료, 오디오 삽입 시작");
  result = end3.getTime() - start.getTime();
  console.log("소요시간", result);

  const finishedPath = await addAudio(transedPath);
  let end4 = new Date();
  console.log("오디오 삽입 및 최종 렌더링 완료, 완료된 비디오:", finishedPath);
  result = end4.getTime() - start.getTime();
  console.log("소요시간", result);

  res.download(finishedPath);
  // res.json({ message: "success" });
});

// effect효과 playlist에 넣기
router.post("/effect", async (req, res, next) => {
  const roomid = req.body.roomid;
  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
  const effect = req.body.effect;
  const idx = req.body.idx;
  playlist[idx].effect = effect;
  await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
  res.send(playlist);
});
// effect 지우기(해당 인덱스만) 아직 미구현 / 컴포넌트 추가예정
router.post("/deleffect", async (req, res, next) => {
  const roomid = req.body.roomid;
  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
  const idx = req.body.idx;
  playlist[idx].effect = "";
  await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
  res.send(playlist);
});

// transition효과 playlist에 넣기
router.post("/transition", async (req, res, next) => {
  const roomid = req.body.roomid;
  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));

  const transition = req.body.transition;
  const idx = req.body.idx;
  playlist[idx].transition = transition;

  await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
  res.send(playlist);
});
// 클릭으로 transition 지우기(해당 인덱스만)
router.post("/deltransition", async (req, res, next) => {
  const roomid = req.body.roomid;
  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));

  const idx = req.body.idx;
  playlist[idx].transition = "";

  await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
  res.send(playlist);
});

// 재생목록 호출 API
router.post("/getplaylist", async (req, res, next) => {
  const roomid = req.body.roomid;
  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
  if (playlist === null) {
    playlist = [];
  }
  res.send(playlist);
});

router.post("/playlistpreset", async (req, res, next) => {
  let presets = [
    [],
    [
      {
        url: "",
        duration: 5,
        select: false,
        transition: "",
        effect: "",
      },
      {
        url: "",
        duration: 5,
        select: false,
        transition: "",
        effect: "",
      },
      {
        url: "",
        duration: 15,
        select: false,
        transition: "",
        effect: "",
      },
      {
        url: "",
        duration: 15,
        select: false,
        transition: "",
        effect: "",
      },
      {
        url: "",
        duration: 5,
        select: false,
        transition: "",
        effect: "",
      },
    ],
    [
      {
        url: "",
        duration: 15,
        select: false,
        transition: "",
        effect: "",
      },
      {
        url: "",
        duration: 5,
        select: false,
        transition: "",
        effect: "",
      },
      {
        url: "",
        duration: 5,
        select: false,
        transition: "",
        effect: "",
      },
      {
        url: "",
        duration: 5,
        select: false,
        transition: "",
        effect: "",
      },
      {
        url: "",
        duration: 20,
        select: false,
        transition: "",
        effect: "",
      },
    ],
  ];

  const idx = req.body.idx;
  const roomid = req.body.roomid;

  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
  playlist = JSON.parse(JSON.stringify(presets[idx]));
  await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));

  res.json({ results: playlist });
});

router.post("/postplaylist", async (req, res, next) => {
  const roomid = req.body.roomid;
  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));

  const url = req.body.url;
  const idx = req.body.idx;
  playlist[idx].url = url;

  await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
  res.send(playlist);
});

// 삭제 이벤트 해당 객체 삭제
router.post("/deleteplayurl", async (req, res, next) => {
  const roomid = req.body.roomid;
  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
  const idx = req.body.idx;

  playlist = playlist.filter((data, i) => {
    if (idx !== i) {
      return data;
    }
  });

  await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
  res.send(playlist);
});

// 재생목록 click시 이벤트
router.post("/clickimg", async (req, res, next) => {
  const roomid = req.body.roomid;
  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));

  const idx = req.body.idx;
  const url = playlist[idx].url;

  let check = false;
  let time = playlist[idx].duration;
  let totaltime = 0;
  playlist.forEach((data, i) => {
    if (i !== idx && data.select === true) {
      // 0번째 일때 0과 false가 겹쳐서 의도와 다른 결과가 나옴
      check = String(i);
    }
    if (i < idx) {
      time += playlist[i].duration;
    }
    totaltime += data.duration;
  });

  if (check) {
    check = Number(check);
    playlist[idx].url = playlist[check].url;
    playlist[check].url = url;
    playlist[idx].select = false;
    playlist[check].select = false;
    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    res.json({ playlist });
  } else if (playlist[idx].select) {
    playlist[idx].select = false;
    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    res.json({ playlist });
  } else {
    playlist[idx].select = true;
    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    res.json({
      playlist,
      time: time,
      duration: playlist[idx].duration,
      totaltime: totaltime,
    });
  }
});
// 새로운 사진을 재생목록에 추가(프리셋 말고)
router.post("/inputnewplay", async (req, res, next) => {
  const roomid = req.body.roomid;
  const url = req.body.url;

  const newimage = {
    url: url,
    duration: 5,
    select: false,
    effect: "",
    transition: "",
    effect: "",
  };

  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
  if (playlist === null) {
    playlist = [];
  }
  playlist.push(newimage);

  await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
  res.send(playlist);
});
// 이미지 재생 시간 변경
router.post("/changetime", async (req, res, next) => {
  const roomid = req.body.roomid;
  let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
  const idx = req.body.idx;
  const time = req.body.time;

  playlist[idx].select = false;
  playlist[idx].duration += time;

  await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
  res.json({ playlist, DT: playlist[idx].duration });
});

module.exports = router;
