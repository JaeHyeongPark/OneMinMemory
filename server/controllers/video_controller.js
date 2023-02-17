const ffmpeg = require("fluent-ffmpeg");
// const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
// const ffprobePath = require("@ffprobe-installer/ffprobe").path;
// ffmpeg.setFfmpegPath(ffmpegPath);
// ffmpeg.setFfprobePath(ffprobePath);

// mergeAll
// ffmpeg("../Output.mp4")
//   .input("../Output2.mp4")
//   .input("../Output3.mp4")
//   .input("../Output4.mp4")
//   .videoCodec("libx264")
//   .audioCodec("libmp3lame")
//   //   .size("1920x1080")
//   .on("error", function (err) {
//     console.log("An error occurred: " + err.message);
//   })
//   .on("end", function () {
//     console.log("Processing finished !");
//   })
//   .mergeToFile("../mergeAll.mp4", "./");
//   .save("../testOutput.mp4");

// complexfilterling
// ffmpeg("../Output.mp4")
//   //   .videoCodec("libx264")
//   //   .audioCodec("libmp3lame")
//   .complexFilter(
//     [
//       // Rescale input stream into stream 'rescaled'
//       "scale=640:480[rescaled]",

//       // Duplicate rescaled stream 3 times into streams a, b, and c
//       {
//         filter: "split",
//         options: "3",
//         inputs: "rescaled",
//         outputs: ["a", "b", "c"],
//       },

//       // Create stream 'red' by removing green and blue channels from stream 'a'
//       {
//         filter: "lutrgb",
//         options: { g: 0, b: 0 },
//         inputs: "a",
//         outputs: "red",
//       },

//       // Create stream 'green' by removing red and blue channels from stream 'b'
//       {
//         filter: "lutrgb",
//         options: { r: 0, b: 0 },
//         inputs: "b",
//         outputs: "green",
//       },

//       // Create stream 'blue' by removing red and green channels from stream 'c'
//       {
//         filter: "lutrgb",
//         options: { r: 0, g: 0 },
//         inputs: "c",
//         outputs: "blue",
//       },

//       // Pad stream 'red' to 3x width, keeping the video on the left,
//       // and name output 'padded'
//       {
//         filter: "pad",
//         options: { w: "iw*3", h: "ih" },
//         inputs: "red",
//         outputs: "padded",
//       },

//       // Overlay 'green' onto 'padded', moving it to the center,
//       // and name output 'redgreen'
//       {
//         filter: "overlay",
//         options: { x: "w", y: 0 },
//         inputs: ["padded", "green"],
//         outputs: "redgreen",
//       },

//       // Overlay 'blue' onto 'redgreen', moving it to the right
//       {
//         filter: "overlay",
//         options: { x: "2*w", y: 0 },
//         inputs: ["redgreen", "blue"],
//         outputs: "output",
//       },
//     ],
//     "output"
//   )
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
//   .save("../complexOutput.mp4");

//waterfall;
ffmpeg()
  .addInput("Output2.mp4")
  .addInput("Output3.mp4")
  .outputOptions([
    "-filter_complex",
    "[0:v][1:v]xfade=transition=hrslice:duration=2:offset=4",
  ])
  .output("waterfallOutput.mp4")
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
  .run();

// ffmpeg("../Output.mp4")
//   //   .input("../Output2.mp4")
//   //   .videoCodec("libx264")
//   //   .audioCodec("libmp3lame")
//   .videoFilters(["fade=in:0:30", "pad=640:480:0:40:violet"])
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
//   .save("../fadepadOutput.mp4");
