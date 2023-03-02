const express = require("express");
const sharp = require("sharp");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const axios = require("axios");
const multer = require("multer");
const redis = require("./RedisClient");

dotenv.config();
AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.Access_key_ID,
  secretAccessKey: process.env.Secret_access_key,
});

const upload = multer();
const s3 = new AWS.S3();
const router = express.Router();

module.exports = function (io) {
  // 캔버스로 보낼 이미지의 타입을 알기위한 함수
  router.post("/imageinfo", async (req, res, next) => {
    const imgBuffer = await axios.get(req.body.url, {
      responseType: "arraybuffer",
    });
    const image = sharp(imgBuffer.data);
    image.metadata().then((data) => {
      res.json({ type: data.format });
    });
  });
  // 캔버스에서 작업이 끝난 이미지를 저장했을때 호출
  router.post("/newimage", upload.none(), async (req, res) => {
    console.log("받기 시작함");
    const roomid = req.body.roomid;
    const id = req.body.id
    const imageurl = req.body.imagedata.split("base64,")[1];
    const s3filename = req.body.originurl.split(`${roomid}/Original/`)[1];

    const imgbuffer = Buffer.from(imageurl, "base64");
    const image = sharp(imgbuffer);
    const imgMeta = await image.metadata();

    const url = `${roomid}/Effect/${id}` + s3filename;
    const params = {
      Bucket: process.env.Bucket_Name,
      Key: url,
      ACL: "public-read",
      Body: imgbuffer,
      ContentType: "image/" + imgMeta.format,
      // CacheControl: "no-store",
    };

    await redis.v4.rPush(
      `${roomid}/effect`,
      `https://d1vnetyz8ckxw7.cloudfront.net/` +
        url
    );
    await redis.v4.expire(`${roomid}/effect`, 21600)

    await s3.putObject(params).promise();
    res.send({ success: true });
    // cors 방법 변경(나중에 문제 생길시 복구)
    // io.to(roomid).emit("edit", {
    //   editedUrl:
    //     `https://${process.env.Bucket_Name}.s3.ap-northeast-2.amazonaws.com/` +
    //     url,
    // });
    io.to(roomid).emit("edit", {
      editedUrl:
      `https://d1vnetyz8ckxw7.cloudfront.net/` +
        url,
    });
  });

  // 이미지 효과 기능들
  // 밝게
  router.post("/image/Brighten", upload.none(), async (req, res) => {
    // console.log("밝은 사진!");
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
    // console.log("선명한 사진!");
    const imageurl = req.body.SharpenImageData.split("base64,")[1];
    const imgbuffer = Buffer.from(imageurl, "base64");
    const imgFormat = (await sharp(imgbuffer).metadata()).format;
    const SharpenBuffer = await sharp(imgbuffer)
      .sharpen({ sigma: 2 })
      .toBuffer();
    const effectedImageData = `data:image/${imgFormat};base64,${SharpenBuffer.toString(
      "base64"
    )}`;

    res.json({ effectedImageData });
  });
  // 색감 증가
  router.post("/image/Saturate", upload.none(), async (req, res) => {
    // console.log("색감!");
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
    // console.log("흑백!");
    const imageurl = req.body.GrayscaleImageData.split("base64,")[1];
    const imgbuffer = Buffer.from(imageurl, "base64");
    const imgFormat = (await sharp(imgbuffer).metadata()).format;
    const GrayscaleBuffer = await sharp(imgbuffer).grayscale().toBuffer();
    const effectedImageData = `data:image/${imgFormat};base64,${GrayscaleBuffer.toString(
      "base64"
    )}`;

    res.json({ effectedImageData });
  });
  return router;
};
