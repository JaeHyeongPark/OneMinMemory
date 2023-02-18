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

const images = [
  "./images/test0.jpg",
  "./images/test1.jpg",
  "./images/test2.jpg",
  "./images/test3.jpg",
  "./images/test4.jpg",
  "./images/test5.jpg",
];

const videos = [
  "./input/source0.mp4",
  "./input/source1.mp4",
  "./input/source2.mp4",
  "./input/source3.mp4",
  "./input/source4.mp4",
  "./input/source5.mp4",
];

const duration = [8, 7, 5, 5, 5, 5];

const preset = [
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
function mergeEffect(preset, inputPath) {
  // ffmpeg()
  //   .addInput(inputPath[0])
  //   .addInput(inputPath[1])
  //   .outputOptions(preset[0])
  //   //   .size("1920x1080")
  //   .on("start", function (commandLine) {
  //     console.log("Spawned Ffmpeg with command: " + commandLine);
  //   })
  //   .on("error", function (err) {
  //     console.log("An error occurred: " + err.message);
  //   })
  //   .on("end", function () {
  //     console.log("Processing finished !");
  //   })
  //   .save("./output/tempOutput.mp4");

  for (let i = 0; i < inputPath.length - 1; i++) {
    ffmpeg()
      .addInput(inputPath[i])
      .addInput(inputPath[i + 1])
      .outputOptions(preset[i])
      //   .size("1920x1080")
      .on("start", function (commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("error", function (err) {
        console.log("An error occurred: " + err.message);
      })
      .on("end", function () {
        console.log("Processing finished !");
      })
      .save("./output/" + i + ".mp4");
  }

  // ffmpeg()
  //   .addInput("./output/tempOutput.mp4")
  //   .addInput("./output/tempOutput2.mp4")
  //   .outputOptions([
  //     "-filter_complex",
  //     "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4",
  //   ])
  //   //   .size("1920x1080")
  //   .on("start", function (commandLine) {
  //     console.log("Spawned Ffmpeg with command: " + commandLine);
  //   })
  //   .on("error", function (err) {
  //     console.log("An error occurred: " + err.message);
  //   })
  //   .on("end", function () {
  //     console.log("Processing finished !");
  //   })
  //   .save("./output/tempOutput3.mp4");
}
// mergeEffect(preset, videos);

function mergeAll() {
  ffmpeg("./output/0.mp4")
    .input("./output/1.mp4")
    .input("./output/2.mp4")
    .input("./output/3.mp4")
    .input("./output/4.mp4")
    //   .size("1920x1080")
    .on("error", function (err) {
      console.log("An error occurred: " + err.message);
    })
    .on("end", function () {
      console.log("Processing finished !");
    })
    .mergeToFile("./output/mergeAll.mp4", "./temp");
}
// mergeAll();

function addAudio() {
  ffmpeg("./output/mergeAll.mp4")
    // .noAudio()
    .addInput(
      "../Hoang - Run Back to You (Official Lyric Video) feat. Alisa_128kbps.mp3"
    )
    .videoCodec("libx264")
    .audioCodec("libmp3lame")
    .save("./output/finished.mp4");
}
addAudio();
