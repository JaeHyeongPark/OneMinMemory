// socket.io 라우터
const express = require("express");
const app = express();
const router = express.Router();
// socket IO용 모듈 import
const socketio = require("socket.io");
const http = require("http");
// express 기반 http server 생성과 socket 연결
const httpServer = http.createServer(app);

let roomIdToUser = {};

module.exports = function (io) {
  router.io = io;
  router.io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => {
      socket.join(data.roomId);
      if (!roomIdToUser.hasOwnProperty(data.roomId)) {
        roomIdToUser[data.roomId] = [data.id];
      } else {
        roomIdToUser[data.roomId].push(data.id);
      }
    });
    socket.on("pictureUpload", (data) => {
      socket.to(data.roomId).emit("upload", { uploaderId: data.Id });
    });
    socket.on("pictureDelete", (data) => {
      socket.to(data.roomId).emit("delete", { deleterId: data.Id });
    });
    socket.on("pictureEdited", (data) => {
      socket.to(data.roomId).emit("edit", { editorId: data.Id });
    });
  });
  return router;
};
