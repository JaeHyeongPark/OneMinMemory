const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// var images = [
//   "../../assets/photo-512-white.png",
//   "../../../MainScreen/kakao.png",
//   "../../../MainScreen/background.png",
// ];

// var videoOptions = {
//   fps: 30,
//   loop: 1,
//   transition: false,
//   videoBitrate: 1024,
//   format: "mp4",
//   pixelFormat: "yuv420p",
// };

// vidoeshow(images, videoOptions)
//   .save("../../assets/test.mp4")
//   .on("start", function(command) {
//     console.log("ffmpeg process started:", command);
//   })
//   .on("error", function(err, stdout, stderr) {
//     console.error("Error:", err);
//     console.error("ffmpeg stderr:", stderr);
//   })
//   .on("end", function(output) {
//     console.log("ffmpeg process end:", command);
//   });

var videoShow = require("videoshow");
// var Jimp = require("jimp");

var images = ["./test1.jpg"];

// for (let i = 0; i < images.length; i++) {
//   images[i].resize(Jimp.auto, 1080);
// }

var videoOptions = {
  loop: 5,
  fps: 25,
  transition: true,
  transitionDuration: 1, // seconds
  videoBitrate: 1024,
  videoCodec: "libx264",
  size: "640x?",
  audioBitrate: "128k",
  audioChannels: 2,
  format: "mp4",
  pixelFormat: "yuv420p",
};

videoShow(images, videoOptions)
  .save("slideshow.mp4")
  .on("start", function(command) {
    console.log("Conversion started" + command);
  })
  .on("error", function(err, stdout, stderr) {
    console.log("Some error occured" + err);
  })
  .on("end", function(output) {
    console.log("Conversion completed" + output);
  });
