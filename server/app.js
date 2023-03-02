const socketio = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const AWS_S3_router = require("./Router_storage/AWS-S3-Router");
const Canvas_router = require("./Router_storage/Canvas-Router");
const Output_router = require("./Router_storage/Output-Router");
const MainPage_router = require("./Router_storage/MainPage-Router");
const Socket_router = require("./Router_storage/Socket-Router");
const FFmpeg_router = require("./Router_storage/FFmpeg-Router")
const dotenv = require("dotenv");

// ==============클러스터 관련 모듈=================================
// const { setupMaster, setupWorker } = require("@socket.io/sticky");
// const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
// const recluster = require("recluster");
// const cluster = require("cluster");
//=====================================================================
// router 추가 by 충일
// express 기반 http server 생성과 socket 연결 by 충일
const app = express();
const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer, {
  path: "/mainsocket",
  cors: {
    origin: process.env.AccessAllowURL,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  },
});
app.use(cors());
app.use(bodyParser.json());
// socket 라우터는 여기로~ by 충일
app.use("/mainsocket", Socket_router(io));
// photoBox 라우터는 다 여기로 슝슝~~
app.use("/photoBox", AWS_S3_router(io));
// canvas 라우터는 여기로~~
app.use("/canvas", Canvas_router(io));
// output 라우터는 일루~
app.use("/output", Output_router(io));
// FFmpeg 라우터는 here~
app.use("/FFmpeg", FFmpeg_router(io))
// MainPage 라우터는 여기로~~~
app.use("/home", MainPage_router);

//===========클러스터 관련 코드(작업중)=============
// setupMaster(httpServer, {
//   loadBalancingMethod: "least-connection",
// });
// cluster.setupMaster({
//   serialization: "advanced",
// });
// // setup connections between the workers
// setupPrimary();
//=======================================

// socket.io error handling
io.on("error", (err) => {
  console.error("Socket.IO Error:", err);
});
// 쓸데없는 URL로 접근시 에러 표시
app.use((req, res, next) => {
  const error = new Error("해당 페이지는 존재하지 않습니다.");
  error.code = 404;
  next(error);
});

// 오류 처리 use이다. 오류 처리 use는 인자를 4개 받는 특별한놈 첫번쨰 인자로 무슨 오류 객체를 받는다.
app.use((error, req, res, next) => {
  // res.headerSent는 현재 응답을 보냈는지 확인하는 놈 응답을 보냈다면 next로 error를 보내준다.
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "알 수 없는 오류입니다." });
});

// app.listen에서 httpServer.listen으로 수정 by 충일
httpServer.listen(5000, () => console.log("서버 연결 성공!"));

// const balancer = recluster(path.join(__dirname, "worker.js"));

// balancer.run();
