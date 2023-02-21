const ffmpeg = require("fluent-ffmpeg");
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffprobePath = require("@ffprobe-installer/ffprobe").path;
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

// const transitions = [
//   ["-filter_complex", "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4"],
//   ["-filter_complex", "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4"],
//   ["-filter_complex", "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4"],
//   ["-filter_complex", "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4"],
//   ["-filter_complex", "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4"],
// ];

let playlist = [
  {
    url: "../Router_storage/input/test8.jpg",
    duration: 10,
    select: false,
    effect: "",
    transition: "",
  },
  // {
  //   url: "../Router_storage/input/test2.jpg",
  //   duration: 10,
  //   select: false,
  //   effect: "",
  //   transition: "",
  // },
  // {
  //   url: "",
  //   duration: 4,
  //   select: false,
  //   transition: "",
  // },
  // {
  //   url: "",
  //   duration: 4,
  //   select: false,
  //   transition: "",
  // },
  // {
  //   url: "",
  //   duration: 7,
  //   select: false,
  //   transition: "",
  // },
];

const filter1 = [
  "scale=1280:720[rescaled]",
  {
    filter: "frei0r",
    options: "vertigo",
    inputs: "rescaled",
    outputs: "filtered",
  },
  {
    filter: "overlay",
    options: "(main_w-overlay_w)/2:(main_h-overlay_h)/2:shortest=1",
    inputs: "filtered",
    outputs: "overlayed",
  },
  {
    filter: "vignette",
    inputs: "overlayed",
    outputs: "vignetted",
  },
  {
    filter: "curves",
    options: "preset=increase_contrast",
    inputs: "vignetted",
    outputs: "output",
  },
];

const filter2 = [
  "-filter_complex",
  "curves=preset=vintage, hue=s=0, scale=1280:720, split [a][b]; [a] noise=alls=20:allf=t, unsharp=luma_msize_x=3:luma_msize_y=3:luma_amount=0.4, scale=1280:720 [c]; [b] curves=preset=lighter, scale=1280:720 [d]; [c][d] blend=all_mode='addition'",
  // "-c:v",
  // "libx264",
  // "-preset",
  // "slow",
  // "-crf",
  // "22",
  // "-c:a",
  // "copy",
];

const filter3 = [
  "-filter_complex",
  "drawbox=x='(w-tw)/2+((t*w)/20)':y='(h-th)/2+((t*h)/20)':w=120:h=120:color=red@0.5",
];

const filter4 = [
  "-filter_complex",
  "[0,v]scale=1280x720[bg];[1:v]scale=1280x720[fg];[bg][fg]overlay=-6400+t*640:-1680[tmp];[tmp]scale=iw/10:ih/10[v]",
  "-map",
  "[v]",
];

const filter5 = [
  "-filter_complex",
  "scale=iw*2:-1,zoompan=z='min(zoom+0.0025,1.5)':d=1",
  // "-map",
  // "[v]",
];

const filter6 = [
  "-filter_complex",
  "[0:v]zoompan=z='zoom+0.001':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=125,format=yuv420p[v]",
  "-map",
  "[v]",
];

// 중앙 줌 and jitter
const filter8 = [
  "-filter_complex",
  "zoompan=z=pzoom+0.001:x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1280x720:fps=30",
];

// left top zoompan
const filter9 = [
  "-filter_complex",
  "scale=12800x7200,zoompan=z=pzoom+0.003:d=1:s=1280x720:fps=30",
];

// right top zoompan
const filter10 = [
  "-filter_complex",
  "scale=12800x7200,zoompan=z=pzoom+0.005:x='iw/2+iw/zoom/2':y=y:d=1:s=1280x720:fps=30",
];

// left bottom zoompan
const filter11 = [
  "-filter_complex",
  "scale=12800x7200,zoompan=z=pzoom+0.003:y=7200:d=1:s=1280x720:fps=30",
];

// right bottom zoompan
const filter12 = [
  "-filter_complex",
  "scale=12800x7200,zoompan=z=pzoom+0.003:x='iw/2+iw/zoom/2':y=7200:d=1:s=1280x720:fps=30",
];

function imageToVideos(imagePath, durations) {
  return new Promise((resolve, reject) => {
    let videos = [];
    let cnt = 0;

    for (let i = 0; i < imagePath.length; i++) {
      const videoPath = `../Router_storage/input/source${i}.mp4`;
      ffmpeg(imagePath[i])
        .size("1280x720")
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
          cnt += 1;
          if (cnt === imagePath.length) {
            resolve(videos);
          }
        })
        .save(videoPath);
    }
  });
}

function addEffects(inputPath) {
  return new Promise((resolve, reject) => {
    let effectedVideos = [];
    let cnt = 0;

    for (let i = 0; i < inputPath.length; i++) {
      const effectedPath = `../Router_storage/input/effects${i}.mp4`;
      ffmpeg(inputPath[i])
        .outputOptions(filter3)
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

function mergeTransitions(inputPath, transitions) {
  return new Promise((resolve, reject) => {
    let transedVideos = [];
    let cnt = 0;

    for (let i = 0; i < inputPath.length - 1; i++) {
      const transedPath = `../Router_storage/input/transed${i}.mp4`;
      ffmpeg()
        .addInput(inputPath[i])
        .addInput(inputPath[i + 1])
        .outputOptions(
          "-filter_complex",
          `[0:v][1:v]xfade=transition=${transitions[i]}:duration=1:offset=3`
        )
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
          cnt += 1;
          if (cnt === inputPath.length - 1) {
            resolve(transedVideos);
          }
        })
        .save(transedPath);
    }
  });
}

function mergeAll(inputPath) {
  return new Promise((resolve, reject) => {
    const mergedVideo = "../Router_storage/output/merged.mp4";
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
        "../Router_storage/output/merged.mp4",
        "../Router_storage/temp"
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
        const finishedVideo = `../Router_storage/output/oneminute_${Date.now()}.mp4`;
        ffmpeg(inputPath)
          .videoCodec("libx264")
          .audioCodec("libmp3lame")
          .size("1280x720")
          .addInput(
            "../Hoang - Run Back to You (Official Lyric Video) feat. Alisa_128kbps.mp3"
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

async function mergeprocess(playlist) {
  const images = playlist.map(({ url }) => url);
  const durations = playlist.map(({ duration }) => duration);
  const transitions = playlist.map(({ transition }) => transition);
  console.log("동영상 생성을 시작합니다~~~~!!");
  const videoPaths = await imageToVideos(images, durations);
  console.log("이미지를 비디오로 변환 완료, 변환된 비디오:", videoPaths);
  const effectedPaths = await addEffects(videoPaths);
  console.log("이펙트 비디오로 변환 완료, 변환된 비디오:", effectedPaths);
  // const transedPaths = await mergeTransitions(effectedPaths, transitions);
  // console.log("트랜지션 비디오로 변환 완료, 변환된 비디오:", transedPaths);
  // const mergedPath = await mergeAll(transedPaths);
  // console.log("비디오 병합 완료, 변환된 비디오:", mergedPath);
  // const finishedPath = await addAudio(mergedPath);
  // console.log("오디오 삽입 및 최종 렌더링 완료, 완료된 비디오:", finishedPath);
}
mergeprocess(playlist);

// function imageToVideos(imagePath, duration) {
//   for (let i = 0; i < imagePath.length; i++) {
//     ffmpeg(imagePath[i])
//       .loop(duration[i])
//       .on("start", function (commandLine) {
//         console.log("Spawned Ffmpeg with command: " + commandLine);
//       })
//       .on("error", function (err) {
//         console.log("An error occurred: " + err.message);
//       })
//       .on("end", function () {
//         console.log("Processing finished !");
//       })
//       .save("./input/source" + i + ".mp4");
//   }
// }
// // imageToVideos(images, duration);

// //hrslice;
// function mergeTransitions(inputPath, transitions) {
//   console.log(transitions);
//   for (let i = 0; i < inputPath.length - 1; i++) {
//     ffmpeg()
//       .addInput(inputPath[i])
//       .addInput(inputPath[i + 1])
//       .outputOptions(transitions[i])
//       .on("start", function (commandLine) {
//         console.log("Spawned Ffmpeg with command: " + commandLine);
//       })
//       .on("error", function (err) {
//         console.log("An error occurred: " + err.message);
//       })
//       .on("end", function () {
//         console.log("Processing finished !");
//       })
//       .save(`../Router_storage/input/transed${i}.mp4`);
//   }
// }
// mergeTransitions(videos, transitions);

// function mergeAll(inputPath) {
//   const mergeVideos = ffmpeg();
//   const effectVideos = inputPath;
//   effectVideos.forEach((effectVideo) => {
//     mergeVideos.addInput(effectVideo);
//   });

//   mergeVideos
//     .on("error", function (err) {
//       console.log("An error occurred: " + err.message);
//     })
//     .on("end", function () {
//       console.log("Processing finished !");
//     })
//     .mergeToFile(
//       "../Router_storage/output/merged.mp4",
//       "../Router_storage/temp"
//     );
// }
// // mergeAll(effectVideos);

// function addAudio() {
//   ffmpeg("../Router_storage/output/merged.mp4")
//     // .noAudio()
//     .videoCodec("libx264")
//     .audioCodec("libmp3lame")
//     .size("1080x720")
//     .addInput(
//       "../Hoang - Run Back to You (Official Lyric Video) feat. Alisa_128kbps.mp3"
//     )
//     .on("error", function (err) {
//       console.log("An error occurred: " + err.message);
//     })
//     .on("end", function () {
//       console.log("Processing finished !");
//     })
//     .save(`../Router_storage/output/oneminute_${Date.now()}.mp4`);
// }
// addAudio();

// var videoOptions = {
//   loop: 3,
//   fps: 25,
//   transition: true,
//   transitionDuration: 1, // seconds
//   videoBitrate: 3000,
//   videoCodec: "libx264",
//   size: "1080x?",
//   audioBitrate: "128k",
//   audioChannels: 2,
//   format: "mp4",
//   pixelFormat: "yuv420p",
// };

// videoShow(images, videoOptions)
//   .audio(
//     "Hoang - Run Back to You (Official Lyric Video) feat. Alisa_128kbps.mp3"
//   )
//   .save("Output.mp4")
//   .on("start", function (command) {
//     console.log("Conversion started" + command);
//   })
//   .on("error", function (err, stdout, stderr) {
//     console.log("Some error occured" + err);
//   })
//   .on("end", function (output) {
//     console.log("Conversion completed" + output);
//     res.download("Output.mp4");
//   });
// console.log("Conversion completed 2222");

//원본
// function imageToVideos(imagePath, durations) {
//   for (let i = 0; i < imagePath.length; i++) {
//     ffmpeg(imagePath[i])
//       .loop(durations[i])
//       .on("start", function (commandLine) {
//         console.log("Spawned Ffmpeg with command: " + commandLine);
//       })
//       .on("error", function (err) {
//         console.log("An error occurred: " + err.message);
//       })
//       .on("end", function () {
//         console.log("Processing finished !");
//       })
//       .save(`./Router_storage/input/source${i}.mp4`);
//   }
// }

//원본
// function mergeTransitions(inputPath, transitions) {
//   for (let i = 0; i < inputPath.length - 1; i++) {
//     ffmpeg()
//       .addInput(inputPath[i])
//       .addInput(inputPath[i + 1])
//       .outputOptions(transitions[i])
//       .on("start", function (commandLine) {
//         console.log("Spawned Ffmpeg with command: " + commandLine);
//       })
//       .on("error", function (err) {
//         console.log("An error occurred: " + err.message);
//       })
//       .on("end", function () {
//         console.log("Processing finished !");
//       })
//       .save(`./Router_storage/input/transed${i}.mp4`);
//   }
// }

//원본
// router.post("/merge", async (req, res, next) => {
//   console.log(req.body.playlist);
//   console.log(req.body.translist);
//   const images = req.body.playlist.map(({ url }) => url);
//   const durations = req.body.playlist.map(({ duration }) => duration);
//   console.log(images);
//   const transitions = req.body.translist.map(({ transition }) => transition);
//   console.log("동영상 생성을 시작합니다~~~~!!");
//   const videos = await imageToVideos(images, durations);
//   mergeTransitions(videos, transitions);
// });

//inputDuration 삽입 전
// function addAudio(inputPath) {
//   return new Promise((resolve, reject) => {
//     const finishedVideo = `./Router_storage/output/oneminute_${Date.now()}.mp4`;
//     ffmpeg(inputPath)
//       .videoCodec("libx264")
//       .audioCodec("libmp3lame")
//       .size("1080x720")
//       .addInput(
//         "./Hoang - Run Back to You (Official Lyric Video) feat. Alisa_128kbps.mp3"
//       )
//       // .inputOptions("-t " + inputDuration) // Get input video duration and set it as an input option
//       // .audioFilters("atrim=0:" + inputDuration, "adelay=0|" + audioDelay) // Cut audio and add delay
//       .on("start", function (commandLine) {
//         console.log("Spawned Ffmpeg with command: " + commandLine);
//       })
//       .on("error", function (err) {
//         console.log("An error occurred: " + err.message);
//         reject(err);
//       })
//       .on("end", function () {
//         console.log(`Processing ${finishedVideo} finished !`);
//         resolve(finishedVideo);
//       })
//       .save(finishedVideo);
//   });
// }
