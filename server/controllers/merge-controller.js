// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffprobePath = require("@ffprobe-installer/ffprobe").path;
// const ffmpeg = require("fluent-ffmpeg");
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

// var videoShow = require("videoshow");

// var images = [
//   "https://oneminutememory.s3.ap-northeast-2.amazonaws.com/toplay/Effect1675366929219",
//   "./samples/img2.jpg",
//   "./samples/img3.jpg",
//   "./samples/img4.jpg",
// ];

// var videoOptions = {
//   loop: 5,
//   fps: 25,
//   transition: true,
//   transitionDuration: 1, // seconds
//   videoBitrate: 1024,
//   videoCodec: "libx264",
//   size: "1024x?",
//   audioBitrate: "128k",
//   audioChannels: 2,
//   format: "mp4",
//   pixelFormat: "yuv420p",
// };

// videoShow(images[0], videoOptions)
//   .save("video1.mp4")
//   .on("start", function (command) {
//     console.log("Conversion started" + command);
//   })
//   .on("error", function (err, stdout, stderr) {
//     console.log("Some error occured" + err);
//   })
//   .on("end", function (output) {
//     console.log("Conversion completed" + output);
//   });
