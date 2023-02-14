const express = require("express");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const axios = require("axios");
const multer = require("multer")

dotenv.config();
AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.Access_key_ID,
  secretAccessKey: process.env.Secret_access_key,
});

const upload = multer()
const s3 = new AWS.S3();
const router = express.Router();

router.post("/imageinfo", async (req, res, next) => {
  const imgBuffer = await axios.get(req.body.url, { responseType: "arraybuffer" });
  // const imgMeta = await sharp(imgBuffer).metadata()
  const image = sharp(imgBuffer.data)
  image.metadata().then((data) => {
    res.json({width:data.width, height:data.height, type:data.format})
  })
});

router.post("/newimage", upload.none(), async (req, res, next) => {
  const imageurl = req.body.imagedata.split("base64,")[1]
  const s3filename = req.body.originurl.split('test/')[1]
  const imgbuffer = Buffer.from(imageurl ,'base64')
  const image = sharp(imgbuffer)
  const imgMeta = await image.metadata()
  const params = {
    Bucket: process.env.Bucket_Name,
    Key: "test/" + s3filename,
    ACL: "public-read",
    Body: imgbuffer,
    ContentType: "image/" + imgMeta.format,
  };
  s3.putObject(params).promise()
  res.send({data: "hi!"})
})

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