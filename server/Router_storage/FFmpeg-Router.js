const express = require("express");
const sharp = require("sharp");
const redis = require("./RedisClient");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const { spawn } = require("child_process");
const ffmpeg = require("gpu-ffmpeg");
const fs = require("fs");
const path = require("path");

// =====================GPU 가속 코드
const { Command } = ffmpeg;
const nvencPath = "/usr/local/cuda/bin/nvenc";
// Set the video codec to use NVENC with H.264 profile
const videoCodec = "h264_nvenc";
// Set the hardware acceleration options for FFmpeg
ffmpeg.setFfmpegPath(nvencPath);
ffmpeg.setFfprobePath("/usr/local/bin/ffprobe");
Command.prototype._getArguments = function (inputs, output) {
  return ["-hwaccel", "cuvid", "-c:v", videoCodec];
};
//======================

AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.Access_key_ID,
  secretAccessKey: process.env.Secret_access_key,
});

const s3 = new AWS.S3();

const router = express.Router();
dotenv.config();

const effectFilters = {
  ZoomIn_Center: [
    "-vf",
    "scale=6400x3600,zoompan=z='zoom+0.0025':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2):d=300:s=hd720:fps=25",
  ],
  ZoomIn_TopLeft: ["-vf", "zoompan=z='zoom+0.0015':d=300:s=hd720:fps=25"],
  ZoomIn_TopRight: [
    "-vf",
    "scale=6400x3600,zoompan=z='zoom+0.0015':x='x+iw/zoom':d=300:s=hd720:fps=25",
  ],
  ZoomIn_BottomLeft: [
    "-vf",
    "scale=6400x3600,zoompan=z='zoom+0.0015':y=1836:d=300:s=hd720:fps=25",
  ],
  ZoomIn_BottomRight: [
    "-vf",
    "scale=6400x3600,zoompan=z='zoom+0.0015':x='x+iw/zoom':y=1836:d=300:s=hd720:fps=25",
  ],
  ZoomOut_Center: [
    "-vf",
    "scale=6400x3600,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0023))':x='max(1,iw/2-(iw/zoom/2))':y='max(1,ih/2-(ih/zoom/2))':d=500:s=hd720:fps=25",
  ],
  ZoomOut_TopLeft: [
    "-vf",
    "scale=6400x3600,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0022))':d=500:s=hd720:fps=25",
  ],
  ZoomOut_TopRight: [
    "-vf",
    "scale=6400x3600,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0028))':x='if(eq(x,0),0.5*iw,max(1,iw/zoom/2))':d=500:s=hd720:fps=25",
  ],
  ZoomOut_BottomLeft: [
    "-vf",
    "scale=6400x3600,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0024))':y=ih:d=500:s=hd720:fps=25",
  ],
  ZoomOut_BottomRight: [
    "-vf",
    "scale=6400x3600,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0023))':x='if(eq(x,0),0.5*iw,max(1,iw/zoom/2))':y='if(eq(y,0),0.5*ih,max(1,ih/zoom/2))':d=500:s=hd720:fps=25",
  ],
};

const MusicAssets = [
  "",
  "./public/music/Hoang-RunBacktoYou(320kbps).mp3",
  "./public/music/Newjeans-Ditto(320kbps).mp3",
  "./public/music/Coldplay-Yellow(320kbps).mp3",
];

// 영상 작업할 폴더 생성
async function makeFolders(mkdirPath) {
  if (!fs.existsSync(mkdirPath)) {
    fs.mkdirSync(mkdirPath);
    console.log(`${mkdirPath} 폴더 생성 완료`);
  }
}

// 작업할 이미지들 폴더에 저장
function getImages(roomid, inputPath, width, height) {
  return new Promise((resolve, reject) => {
    const promises = [];
    for (let i = 0; i < inputPath.length; i++) {
      // cors 방법 변경(나중에 문제 생길시 복구)
      // const imageKey = inputPath[i].split("com/")[1];
      const imageKey = inputPath[i].split("net/")[1];
      const s3Params = {
        Bucket: process.env.Bucket_Name,
        Key: imageKey,
      };
      const imageStream = s3.getObject(s3Params).createReadStream();
      const localFilePath = `./public/render/${roomid}/input/${Math.random()
        .toString(36)
        .substring(2, 15)}.jpg`;
      const localFileStream = fs.createWriteStream(localFilePath);
      const promise = new Promise((resolve, reject) => {
        localFileStream.on("finish", () => {
          sharp(localFilePath)
            .resize(width, height)
            .toBuffer()
            .then((buffer) => {
              fs.writeFile(localFilePath, buffer, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(localFilePath);
                }
              });
            })
            .catch((err) => reject(err));
        });
      });
      promises.push(promise);
      imageStream.pipe(localFileStream);
    }
    Promise.all(promises)
      .then((images) => resolve(images))
      .catch((err) => reject(err));
  });
}

// 랜더링시 영상에 effect효과 적용
function addEffects(roomid, inputPath, durations, effects, transitions) {
  return new Promise((resolve, reject) => {
    let effectedVideos = [];
    let cnt = 0;

    for (let i = 0; i < inputPath.length; i++) {
      const effectedPath = `./public/render/${roomid}/input/effects${i}.mp4`;
      if (effects[i]) {
        effects[i] = effectFilters[effects[i]];
        if (transitions[i]) {
          ffmpeg(inputPath[i])
            .loop(durations[i] + 1)
            .outputOptions(effects[i])
            .videoCodec(videoCodec)
            .on("start", function (commandLine) {
              console.log("Spawned Ffmpeg with command: " + commandLine);
            })
            .on("error", function (err) {
              console.log("An error occurred: " + err.message);
              reject(err);
            })
            .on("end", function () {
              durations[i] += 1;
              console.log(`Processing ${effectedPath} finished !`);
              effectedVideos[i] = effectedPath;
              cnt += 1;
              if (cnt === inputPath.length) {
                resolve({ effectedVideos, durations });
              }
            })
            .save(effectedPath);
        } else {
          ffmpeg(inputPath[i])
            .loop(durations[i])
            .outputOptions(effects[i])
            .videoCodec(videoCodec)
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
                resolve({ effectedVideos, durations });
              }
            })
            .save(effectedPath);
        }
      } else {
        if (transitions[i]) {
          ffmpeg(inputPath[i])
            .loop(durations[i] + 1)
            .videoCodec(videoCodec)
            .on("start", function (commandLine) {
              console.log("Spawned Ffmpeg with command: " + commandLine);
            })
            .on("error", function (err) {
              console.log("An error occurred: " + err.message);
              reject(err);
            })
            .on("end", function () {
              console.log(`Processing ${effectedPath} finished !`);
              durations[i] = durations[i] + 1;
              effectedVideos[i] = effectedPath;
              cnt += 1;
              if (cnt === inputPath.length) {
                resolve({ effectedVideos, durations });
              }
            })
            .save(effectedPath);
        } else {
          ffmpeg(inputPath[i])
            .loop(durations[i])
            .videoCodec(videoCodec)
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
                resolve({ effectedVideos, durations });
              }
            })
            .save(effectedPath);
        }
      }
    }
  });
}

// 랜더링시 영상에 transition효과 적용
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
      .videoCodec(videoCodec)
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

// 랜더링시 각각의 영상 merge
function ffmpegSyncMerge(prev_video, input, transedPath) {
  console.log("ffmpegSyncMerge 함수 호출");
  return new Promise((resolve, reject) => {
    ffmpeg()
      .addInput(prev_video)
      .addInput(input)
      .videoCodec(videoCodec)
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

// 랜더링시 각각의 transition영상끼리 merge??
function mergeTransitions(roomid, inputPath, durations, transitions) {
  console.log("mergeTransitions 함수 호출");
  return new Promise(async (resolve, reject) => {
    console.log(inputPath);
    let prev_duration = durations[0];
    let prev_video = inputPath[0];
    let flag = true;
    for (let i = 1; i < inputPath.length; i++) {
      let transedPath;
      if (flag) {
        transedPath = `./public/render/${roomid}/input/transed_A.mp4`;
      } else {
        transedPath = `./public/render/${roomid}/input/transed_B.mp4`;
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

// 최종 완성본에 Audio추가
function addAudio(roomid, inputPath, musicsrc) {
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
        const finishedVideo = `./public/render/${roomid}/Final/oneminute_${roomid}.mp4`;
        if (musicsrc === "") {
          console.log("음악 없는 영상 제작");
          ffmpeg(inputPath)
            .videoCodec(videoCodec)
            .size("1280x720")
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
        } else {
          ffmpeg(inputPath)
            .videoCodec(videoCodec)
            .audioCodec("libmp3lame")
            .size("1280x720")
            .addInput(musicsrc)
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
      }
    });
  });
}

// 랜더링 작업 폴더 삭제
const deleteFilesInFolder = async (folderPath) => {
  fs.rm(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("작업 folder 삭제 완료");
    }
  });
};

// 최종 완성본 S3 저장
const AddS3 = async (Path, VideoKey) => {
  const params = {
    Bucket: process.env.Bucket_Name,
    Key: VideoKey,
    ACL: "public-read",
    Body: fs.createReadStream(Path),
    ContentType: "video/mp4",
    CacheControl: "no-store",
  };
  return s3.upload(params).promise();
};

module.exports = function (io) {
  // 랜더링시 호출(각 단계별로 진행되며 이미지로 영상을 추출)
  router.post("/merge", async (req, res, next) => {
    const roomid = req.body.roomid;
    io.to(roomid).emit("mergeStart", {});
    await redis.v4.sendCommand([
      "SET",
      roomid + "/renderVoteState",
      "0",
      "EX",
      "21600",
    ]);
    let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
    console.log(playlist);
    let selectedmusic = JSON.parse(await redis.v4.get(`${roomid}/song`));
    if (playlist === null) {
      return console.log("렌더링 불가! 재생목록에 이미지를 넣어주세요.");
    }
    if (selectedmusic === null) {
      selectedmusic = ["0", ""];
    }

    const renderPath = `./public/render/${roomid}/`;
    const renderInputPath = `./public/render/${roomid}/input/`;
    const renderOutputPath = `./public/render/${roomid}/Final/`;
    const imageUrls = playlist.map(({ url }) => url);
    const durations = playlist.map(({ duration }) => duration);
    const effects = playlist.map(({ effect }) => effect);
    const transitions = playlist.map(({ transition }) => transition);

    await makeFolders(renderPath);
    await makeFolders(renderInputPath);
    await makeFolders(renderOutputPath);

    console.log("이미지 >>>> 동영상(with duration) Rendering...");
    let start = new Date();

    const images = await getImages(roomid, imageUrls, 1280, 720);
    // 25퍼 진행됐음을 클라이언트에 알림
    io.to(roomid).emit("renderingProgress", {
      progress: "Video로 변환 & Effect 적용중 (1/4)",
    });
    let end1 = new Date();
    console.log("이미지 다운 완료:", images);
    let result = end1.getTime() - start.getTime();
    console.log("소요시간", result);
    // resolve {effectedVideos, durations}
    // const {effectedPaths, tmp_durations} = await addEffects(images, durations, effects, transitions);
    const effectedPaths = await addEffects(
      roomid,
      images,
      durations,
      effects,
      transitions
    );
    // 50퍼 진행됐음을 클라이언트에 알림
    io.to(roomid).emit("renderingProgress", {
      progress: "Transition 효과 적용중 (2/4)",
    });
    let end2 = new Date();
    console.log(
      "이펙트 비디오로 변환 완료, 변환된 비디오:",
      effectedPaths.effectedVideos
    );
    result = end2.getTime() - start.getTime();
    console.log("소요시간", result);

    // console.log(tmp_durations)
    const transedPath = await mergeTransitions(
      roomid,
      effectedPaths.effectedVideos,
      effectedPaths.durations,
      transitions
    );
    // 75퍼 진행됐음을 클라이언트에 알림
    io.to(roomid).emit("renderingProgress", {
      progress: "오디오 삽입중 (3/4)",
    });
    let end3 = new Date();
    console.log("비디오 트랜지션 완료, 오디오 삽입 시작");
    result = end3.getTime() - start.getTime();
    console.log("소요시간", result);

    const finishedPath = await addAudio(
      roomid,
      transedPath,
      MusicAssets[selectedmusic[0]]
    );
    // 100퍼 진행됐음을 클라이언트에 알림
    io.to(roomid).emit("renderingProgress", {
      progress: "렌더링 완료!! 저장중.. (4/4)",
    });
    let end4 = new Date();
    console.log(
      "오디오 삽입 및 최종 렌더링 완료, 완료된 비디오:",
      finishedPath
    );
    result = end4.getTime() - start.getTime();
    console.log("소요시간", result);

    // S3에 영상 저장
    const VideoKey = `${roomid}/Final/oneminute_${Date.now()}.mp4`;
    await AddS3(finishedPath, VideoKey);
    console.log("영상 S3 저장 완료");

    // 저장후 작업 폴더 삭제
    await deleteFilesInFolder(renderPath);

    // 영상 완료에 대한 응답
    res.send({ success: true });

    io.to(roomid).emit("mergeFinished", {
      videoURL:
        "https://oneminutememory.s3.ap-northeast-2.amazonaws.com/" + VideoKey,
    });
  });
  return router;
};
