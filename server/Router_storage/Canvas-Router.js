const express = require("express");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.Access_key_ID,
  secretAccessKey: process.env.Secret_access_key,
});
const s3 = new AWS.S3();
const router = express.Router();

router.post("/imageinfo", async (req, res, next) => {
  const imgBuffer = await axios.get(req.body.url, { responseType: "arraybuffer" });
  // const imgMeta = await sharp(imgBuffer).metadata()
  const image = sharp(imgBuffer.data)
  image.metadata().then((data) => {
    res.json({width:data.width, height:data.height})
  })

});

module.exports = router;
