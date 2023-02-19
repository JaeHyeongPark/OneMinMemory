const ffmpeg = require("fluent-ffmpeg");
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffprobePath = require("@ffprobe-installer/ffprobe").path;
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

const FOLDERS = {
  IMAGES: "./images",
  INPUT: "./input",
  OUTPUT: "./output",
  TEMP: "./temp",
};

const ERRORS = {
  IMAGES: "Please add images to the images folder",
  INPUT: "Please add input videos to the input folder",
};

const videos = [
  "../Router_storage/input/source0.mp4",
  "../Router_storage/input/source1.mp4",
  "../Router_storage/input/source2.mp4",
  "../Router_storage/input/source3.mp4",
  "../Router_storage/input/source4.mp4",
  "../Router_storage/input/source5.mp4",
];

const effectVideos = [
  "../Router_storage/input/effect0.mp4",
  "../Router_storage/input/effect1.mp4",
  "../Router_storage/input/effect2.mp4",
  "../Router_storage/input/effect3.mp4",
  "../Router_storage/input/effect4.mp4",
];

const transitions = [
  ["-filter_complex", "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4"],
  ["-filter_complex", "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4"],
  ["-filter_complex", "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4"],
  ["-filter_complex", "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4"],
  ["-filter_complex", "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4"],
];

function imageToVideos(imagePath, duration) {
  for (let i = 0; i < imagePath.length; i++) {
    ffmpeg(imagePath[i])
      .loop(duration[i])
      .on("start", function (commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
      })
      .on("end", function () {
        console.log("Processing finished !");
      })
      .save("./input/source" + i + ".mp4");
  }
}
// imageToVideos(images, duration);

//hrslice;
function mergeTransitions(inputPath, transitions) {
  console.log(transitions);
  for (let i = 0; i < inputPath.length - 1; i++) {
    ffmpeg()
      .addInput(inputPath[i])
      .addInput(inputPath[i + 1])
      .outputOptions(transitions[i])
      .on("start", function (commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
      })
      .on("end", function () {
        console.log("Processing finished !");
      })
      .save(`../Router_storage/input/transed${i}.mp4`);
  }
}
mergeTransitions(videos, transitions);

function mergeAll(inputPath) {
  const mergeVideos = ffmpeg();
  const effectVideos = inputPath;
  effectVideos.forEach((effectVideo) => {
    mergeVideos.addInput(effectVideo);
  });

  mergeVideos
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
    })
    .on("end", function () {
      console.log("Processing finished !");
    })
    .mergeToFile(
      "../Router_storage/output/merged.mp4",
      "../Router_storage/temp"
    );
}
// mergeAll(effectVideos);

function addAudio() {
  ffmpeg("../Router_storage/output/merged.mp4")
    // .noAudio()
    .videoCodec("libx264")
    .audioCodec("libmp3lame")
    .size("1080x720")
    .addInput(
      "../Hoang - Run Back to You (Official Lyric Video) feat. Alisa_128kbps.mp3"
    )
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
    })
    .on("end", function () {
      console.log("Processing finished !");
    })
    .save(`../Router_storage/output/oneminute_${Date.now()}.mp4`);
}
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
