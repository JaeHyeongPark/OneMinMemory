// socket.io 라우터
const express = require("express");
const router = express.Router();
const app = express();
// socket IO용 모듈 import
const socketio = require("socket.io");
const http = require("http");
// express 기반 http server 생성과 socket 연결
const httpServer = http.createServer(app);

let playlist = require("./Output-Router").playlist;

let roomIdToUser = {};

// playlist false:편집가능 true:누가사용중
let playlistPermissionState = false;

module.exports = function (io) {
  router.io = io;
  router.io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => {
      console.log("누가 왔어요~");
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
    socket.on("playlistEditRequest", (data) => {
      console.log("요청왔어요~");
      if (playlistPermissionState === false) {
        playlistPermissionState = true;
        socket.to(data.roomId).emit("playlistEditResponse", { state: 2 });
        io.to(data.Id).emit("playlistEditResponse", { state: 1 });
      } else {
        io.to(data.Id).emit("playlistEditResponse", { state: 2 });
      }
    });
    socket.on("playlistEditFinished", (data) => {
      console.log("편집끝났데요~");
      playlistPermissionState = false;
      socket.to(data.roomId).emit("playlistEditResponse", { state: 0 });
      io.to(data.Id).emit("playlistEditResponse", { state: 0 });
    });
    // 재생목록에 효과 추가
    socket.on("transition", (data) => {
      const transition = data.transition;
      const idx = data.idx;
      playlist[idx].transition = transition;
      socket.to(data.roomId).emit("playlistChanged", { playlist });
      io.to(data.Id).emit("playlistChanged", { playlist });
    });
    // 재생목록 효과 제거
    socket.on("delTransition", (data) => {
      const idx = data.idx;
      playlist[idx].transition = "";
      socket.to(data.roomId).emit("playlistChanged", { playlist });
      io.to(data.Id).emit("playlistChanged", { playlist });
    });
    // 재생목록 사진 추가
    socket.on("postplaylist", (data) => {
      const url = data.url;
      const idx = data.idx;
      playlist[idx].url = url;
      socket.to(data.roomId).emit("playlistChanged", { playlist });
      io.to(data.Id).emit("playlistChanged", { playlist });
    });
    socket.on("deleteplayurl", (data) => {
      const idx = data.idx;
      playlist = playlist.filter((element, i) => {
        if (idx !== i) {
          return element;
        }
      });
      socket.to(data.roomId).emit("playlistChanged", { playlist });
      io.to(data.Id).emit("playlistChanged", { playlist });
    });
    // 클릭 핸들링
    socket.on("clicking", (d) => {
      const idx = d.idx;
      const url = playlist[idx].url;

      let check = false;
      let time = playlist[idx].duration;
      let totaltime = 0;
      playlist.forEach((data, i) => {
        if (i !== idx && data.select === true) {
          // 0번째 일때 0과 false가 겹쳐서 의도와 다른 결과가 나옴
          check = String(i);
        }
        if (i < idx) {
          time += playlist[i].duration;
        }
        totaltime += data.duration;
      });

      if (check) {
        check = Number(check);
        playlist[idx].url = playlist[check].url;
        playlist[check].url = url;
        playlist[idx].select = false;
        playlist[check].select = false;
        socket.to(d.roomId).emit("playlistChanged", { playlist });
        io.to(d.Id).emit("clicking", { playlist });
      } else if (playlist[idx].select) {
        playlist[idx].select = false;
        socket.to(d.roomId).emit("playlistChanged", { playlist });
        io.to(d.Id).emit("clicking", { playlist });
      } else {
        playlist[idx].select = true;
        io.to(d.Id).emit("clicking", {
          playlist,
          idx,
          time: time,
          duration: playlist[idx].duration,
          totaltime: totaltime,
        });
      }
    });
    // 재생목록에 프리셋이 아닌 공간에 새로운 사진을 추가
    socket.on("inputnewplay", (data) => {
      const url = data.url;
      playlist.push({
        url: url,
        duration: 5,
        select: false,
        transition: "",
      });
      socket.to(data.roomId).emit("playlistChanged", { playlist });
      io.to(data.Id).emit("playlistChanged", { playlist });
    });
    socket.on("changetime", (data) => {
      const idx = data.idx;
      const time = data.time;
      playlist[idx].select = false;
      playlist[idx].duration += time;
      socket.to(data.roomId).emit("playlistChanged", { playlist });
      io.to(data.Id).emit("changetime", {
        playlist,
        idx,
        DT: playlist[idx].duration,
      });
    });
  });
  return router;
};
