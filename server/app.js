const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const multer = require("multer");
// const AWS = require("aws-sdk");

const AWS_S3_router = require("./Router_storage/AWS-S3-Router")

// dotenv.config();
// AWS.config.update({
//   region: "ap-northeast-2",
//   accessKeyId: process.env.Access_key_ID,
//   secretAccessKey: process.env.Secret_access_key,
// });

// const s3 = new AWS.S3()
const app = express();
app.use(bodyParser.json())
app.use(cors())

// photoBox 라우터는 다 여기로 슝슝~~
app.use("/photoBox", AWS_S3_router)

// 쓸데없는 URL로 접근시 에러 표시
app.use((req, res, next) => {
    const error = new Error("해당 페이지는 존재하지 않습니다.")
    error.code = 404
    next(error)
})

// 오류 처리 use이다. 오류 처리 use는 인자를 4개 받는 특별한놈 첫번쨰 인자로 무슨 오류 객체를 받는다.
app.use((error, req, res, next) => {
    // res.headerSent는 현재 응답을 보냈는지 확인하는 놈 응답을 보냈다면 next로 error를 보내준다.
    if (res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message : error.message || "알 수 없는 오류입니다."})
})

app.listen(5000, () => console.log("서버 연결 성공!"))