const Creatomate = require("creatomate");

const client = new Creatomate.Client("Insert your API key here");

const source = new Creatomate.Source({
  // Supported formats are mp4, gif, jpg and png
  outputFormat: "mp4",

  // Output resolution
  width: 1280,
  height: 720,

  // Add videos, images, texts, shapes, compositions, keyframes, animations and more. Check out:
  // https://github.com/creatomate/node-examples
  elements: [
    // Video 1
    new Creatomate.Video({
      track: 1,
      source: "https://creatomate-static.s3.amazonaws.com/demo/video1.mp4",
    }),

    // Video 2, played after video 1 as it is on the same track
    new Creatomate.Video({
      track: 1,
      source: "https://creatomate-static.s3.amazonaws.com/demo/video2.mp4",
      transition: new Creatomate.FadeAnimation({ duration: 1 }),
    }),

    // Text overlay
    new Creatomate.Text({
      text: "Your text overlay here",

      // Make the container as big as the screen and add some padding
      width: "100%",
      height: "100%",
      xPadding: "3 vmin",
      yPadding: "8 vmin",

      // Align text to the bottom center
      xAlignment: "50%",
      yAlignment: "100%",

      // Text style
      font: new Creatomate.Font("Aileron", 800, "normal", "8.48 vh"),
      shadow: new Creatomate.Shadow("rgba(0,0,0,0.65)", "1.6 vmin"),
      fillColor: "#ffffff",
    }),
  ],
});

client
  .render({ source })
  .then((renders) => console.log("Your video is ready:", renders));
