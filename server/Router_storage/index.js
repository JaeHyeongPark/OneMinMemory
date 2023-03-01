const Creatomate = require("creatomate");

const client = new Creatomate.Client(
  "5509a229f1be49f98fb43593368905db2b4485da35862709fcc3fdea0c6fdd4cad9821ac5bd5393becb2755150fd1104"
);

client
  .render({
    template_id: "aa682c07-5c46-4169-ad6c-ad17878431eb",
    modifications: {
      "ecf1a01d-ff16-4b5f-a58c-a4998b02e502":
        "https://oneminutememory.s3.ap-northeast-2.amazonaws.com/1440C4/Final/oneminute_1440C4.mp4",
      "Text-1": "Krafton Jungle",
      "Text-2": "TEAM oneminute 221024~230316\n[size 150%]Video[/size]",
    },
  })

  .then((renders) => {
    console.log("Completed", renders);
  });
