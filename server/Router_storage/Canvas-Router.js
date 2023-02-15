const express = require("express");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const axios = require("axios");
const multer = require("multer");

dotenv.config();
AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.Access_key_ID,
  secretAccessKey: process.env.Secret_access_key,
});

const upload = multer();
const s3 = new AWS.S3();
const router = express.Router();

router.post("/imageinfo", async (req, res, next) => {
  const imgBuffer = await axios.get(req.body.url, {
    responseType: "arraybuffer",
  });
  // const imgMeta = await sharp(imgBuffer).metadata()
  const image = sharp(imgBuffer.data);
  image.metadata().then((data) => {
    res.json({ width: data.width, height: data.height, type: data.format });
  });
});

router.post("/newimage", upload.none(), async (req, res) => {
  console.log("받기 시작함");
  const imageurl = req.body.imagedata.split("base64,")[1];
  const s3filename = req.body.originurl.split("test/")[1];
  const imgbuffer = Buffer.from(imageurl, "base64");
  const image = sharp(imgbuffer);
  const imgMeta = await image.metadata();
  const params = {
    Bucket: process.env.Bucket_Name,
    Key: "test/" + s3filename,
    ACL: "public-read",
    Body: imgbuffer,
    ContentType: "image/" + imgMeta.format,
  };
  s3.putObject(params).promise();
  res.send({ data: "hi!" });
});

// 이미지 효과 기능들 : 밝게
router.post("/image/Brighten", upload.none(), async (req, res) => {
  console.log("밝은 사진!");
  const imageurl = req.body.BrightenImageData.split("base64,")[1];
  const imgbuffer = Buffer.from(imageurl, "base64");
  const imgFormat = (await sharp(imgbuffer).metadata()).format;
  const BrightenBuffer = await sharp(imgbuffer)
    .modulate({ brightness: 1.2 })
    .png()
    .toBuffer();
  const effectedImageData = `data:image/${imgFormat};base64,${BrightenBuffer.toString(
    "base64"
  )}`;

  res.json({ effectedImageData });
});
// 선명하게
router.post("/image/Sharpen", upload.none(), async (req, res) => {
  console.log("선명한 사진!");
  const imageurl = req.body.SharpenImageData.split("base64,")[1];
  const imgbuffer = Buffer.from(imageurl, "base64");
  const imgFormat = (await sharp(imgbuffer).metadata()).format;
  const SharpenBuffer = await sharp(imgbuffer).sharpen({ sigma: 2 }).toBuffer();
  const effectedImageData = `data:image/${imgFormat};base64,${SharpenBuffer.toString(
    "base64"
  )}`;

  res.json({ effectedImageData });
});
// 색감 증가
router.post("/image/Saturate", upload.none(), async (req, res) => {
  console.log("색감!");
  const imageurl = req.body.SaturateImageData.split("base64,")[1];
  const imgbuffer = Buffer.from(imageurl, "base64");
  const imgFormat = (await sharp(imgbuffer).metadata()).format;
  const SaturateBuffer = await sharp(imgbuffer)
    .modulate({ saturation: 1.5 })
    .toBuffer();
  const effectedImageData = `data:image/${imgFormat};base64,${SaturateBuffer.toString(
    "base64"
  )}`;

  res.json({ effectedImageData });
});
// 흑백처리
router.post("/image/Grayscale", upload.none(), async (req, res) => {
  console.log("흑백!");
  const imageurl = req.body.GrayscaleImageData.split("base64,")[1];
  const imgbuffer = Buffer.from(imageurl, "base64");
  const imgFormat = (await sharp(imgbuffer).metadata()).format;
  const GrayscaleBuffer = await sharp(imgbuffer).grayscale().toBuffer();
  const effectedImageData = `data:image/${imgFormat};base64,${GrayscaleBuffer.toString(
    "base64"
  )}`;

  res.json({ effectedImageData });
});

module.exports = router;

// AWS S3 cors 정책
// [
//   {
//       "AllowedHeaders": [
//           "*"
//       ],
//       "AllowedMethods": [
//           "HEAD",
//           "GET",
//           "PUT",
//           "POST",
//           "DELETE"
//       ],
//       "AllowedOrigins": [
//           "https://www.example.org"
//       ],
//       "ExposeHeaders": [
//            "ETag",
//            "x-amz-meta-custom-header"]
//   }
// ]
