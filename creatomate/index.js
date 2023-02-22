const Creatomate = require("creatomate");

const client = new Creatomate.Client(
  "5509a229f1be49f98fb43593368905db2b4485da35862709fcc3fdea0c6fdd4cad9821ac5bd5393becb2755150fd1104"
);

console.log("Starting Rendering!");

client
  .render({
    templateId: "aa682c07-5c46-4169-ad6c-ad17878431eb",

    modifications: {
      "Text-1": "일분추억 / Krafton Jungle!",
      "Text-2": "Nuday1",
      Video: "https://creatomate-static.s3.amazonaws.com/demo/video5.mp4",
    },
  })
  .then((renders) => {
    console.log("Complated", renders);
  });
