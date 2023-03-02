const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffprobePath = require("@ffprobe-installer/ffprobe").path;
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

let playlist = [
  {
    url: "../public/render/test/input/test1.jpg",
    duration: 5,
    select: false,
    effect: ZoomIn_Center,
    transition: "",
  },
  {
    url: "../public/render/test/input/test2.jpg",
    duration: 5,
    select: false,
    effect: filter9,
    transition: "",
  },
  // {
  //   url: "../Router_storage/input/test3.jpg",
  //   duration: 5,
  //   select: false,
  //   effect: filter10,
  //   transition: "",
  // },
  // {
  //   url: "../Router_storage/input/test7.jpg",
  //   duration: 5,
  //   select: false,
  //   effect: filter11,
  //   transition: "",
  // },
  // {
  //   url: "../Router_storage/input/test8.jpg",
  //   duration: 5,
  //   select: false,
  //   effect: filter12,
  //   transition: "",
  // },
];

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
    "scale=6400x3600,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0023))':x='max(1,iw/2-(iw/zoom/2))':y='max(1,ih/2-(ih/zoom/2))':d=300:s=hd720:fps=25",
  ],
  ZoomOut_TopLeft: [
    "-vf",
    "scale=6400x3600,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0022))':d=300:s=hd720:fps=25",
  ],
  ZoomOut_TopRight: [
    "-vf",
    "scale=6400x3600,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0028))':x='if(eq(x,0),0.5*iw,max(1,iw/zoom/2))':d=300:s=hd720:fps=25",
  ],
  ZoomOut_BottomLeft: [
    "-vf",
    "scale=6400x3600,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0024))':y=ih:d=300:s=hd720:fps=25",
  ],
  ZoomOut_BottomRight: [
    "-vf",
    "scale=6400x3600,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0023))':x='if(eq(x,0),0.5*iw,max(1,iw/zoom/2))':y='if(eq(y,0),0.5*ih,max(1,ih/zoom/2))':d=300:s=hd720:fps=25",
  ],
};

const MusicAssets = [
  "",
  "../public/music/Hoang-RunBacktoYou(320kbps).mp3",
  "../public/music/Newjeans-Ditto(320kbps).mp3",
  "../public/music/Coldplay-Yellow(320kbps).mp3",
];

async function makeFolders(mkdirPath) {
  if (!fs.existsSync(mkdirPath)) {
    fs.mkdirSync(mkdirPath);
    console.log(`${mkdirPath} 폴더 생성 완료`);
  }
}

// 랜더링시 영상에 effect효과 적용
function addEffects(inputPath, durations, effects, transitions) {
  return new Promise((resolve, reject) => {
    let effectedVideos = [];
    let cnt = 0;

    for (let i = 0; i < inputPath.length; i++) {
      const effectedPath = `../public/render/test/input/effects${i}.mp4`;
      if (effects[i]) {
        effects[i] = effectFilters[effects[i]];
        if (transitions[i]) {
          ffmpeg(inputPath[i])
            .loop(durations[i] + 1)
            .outputOptions(effects[i])
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
function mergeTransitions(inputPath, durations, transitions) {
  console.log("mergeTransitions 함수 호출");
  return new Promise(async (resolve, reject) => {
    console.log(inputPath);
    let prev_duration = durations[0];
    let prev_video = inputPath[0];
    let flag = true;
    for (let i = 1; i < inputPath.length; i++) {
      let transedPath;
      if (flag) {
        transedPath = `../public/render/test/input/transed_A.mp4`;
      } else {
        transedPath = `../public/render/test/input/transed_B.mp4`;
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
function addAudio(inputPath, musicsrc) {
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
        const finishedVideo = `../public/render/test/Final/oneminute_test.mp4`;
        if (musicsrc === "") {
          console.log("음악 없는 영상 제작");
          ffmpeg(inputPath)
            .videoCodec("libx264")
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
            .videoCodec("libx264")
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

function deleteFilesInFolder(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const promises = files.map((file) => {
          const filePath = path.join(folderPath, file);
          return fs.promises.unlink(filePath);
        });
        Promise.all(promises)
          .then(() => resolve(console.log("렌더링 임시파일 삭제 완료")))
          .catch((err) => reject(err));
      }
    });
  });
}

async function mergeprocess(playlist) {
  const renderPath = `../public/render/test/`;
  const renderInputPath = `../public/render/test/input/`;
  const renderOutputPath = `../public/render/test/Final/`;
  // const imageUrls = playlist.map(({ url }) => url);
  const images = playlist.map(({ url }) => url);
  const durations = playlist.map(({ duration }) => duration);
  const effects = playlist.map(({ effect }) => effect);
  const transitions = playlist.map(({ transition }) => transition);

  await makeFolders(renderPath);
  await makeFolders(renderInputPath);
  await makeFolders(renderOutputPath);

  console.log("이미지 >>>> 동영상(with duration) Rendering...");
  let start = new Date();

  // const images = await getImages(imageUrls, 1280, 720);
  // 25퍼 진행됐음을 클라이언트에 알림
  let end1 = new Date();
  console.log("이미지 다운 완료:", images);
  let result = end1.getTime() - start.getTime();
  console.log("소요시간", result);
  // resolve {effectedVideos, durations}
  // const {effectedPaths, tmp_durations} = await addEffects(images, durations, effects, transitions);
  const effectedPaths = await addEffects(
    images,
    durations,
    effects,
    transitions
  );
  // 50퍼 진행됐음을 클라이언트에 알림
  let end2 = new Date();
  console.log(
    "이펙트 비디오로 변환 완료, 변환된 비디오:",
    effectedPaths.effectedVideos
  );
  result = end2.getTime() - start.getTime();
  console.log("소요시간", result);

  // console.log(tmp_durations)
  const transedPath = await mergeTransitions(
    effectedPaths.effectedVideos,
    effectedPaths.durations,
    transitions
  );
  // 75퍼 진행됐음을 클라이언트에 알림
  let end3 = new Date();
  console.log("비디오 트랜지션 완료, 오디오 삽입 시작");
  result = end3.getTime() - start.getTime();
  console.log("소요시간", result);

  const finishedPath = await addAudio(transedPath, MusicAssets[3]);
  // 100퍼 진행됐음을 클라이언트에 알림
  let end4 = new Date();
  console.log("오디오 삽입 및 최종 렌더링 완료, 완료된 비디오:", finishedPath);
  result = end4.getTime() - start.getTime();
  console.log("소요시간", result);

  // 임시 파일 삭제
  // await deleteFilesInFolder(renderInputPath);

  res.send({ success: true });
}

mergeprocess(playlist);
