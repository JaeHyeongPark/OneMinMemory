// socket IO용 모듈 import
const socketio = require("socket.io");
// express 기반 http server 생성과 socket 연결
const redis = require("./RedisClient");
const express = require("express");

const presets = [
  [],
  [
    {
      url: "",
      duration: 5,
      select: false,
      transition: "",
      effect: "",
    },
    {
      url: "",
      duration: 5,
      select: false,
      transition: "",
      effect: "",
    },
    {
      url: "",
      duration: 15,
      select: false,
      transition: "",
      effect: "",
    },
    {
      url: "",
      duration: 15,
      select: false,
      transition: "",
      effect: "",
    },
    {
      url: "",
      duration: 5,
      select: false,
      transition: "",
      effect: "",
    },
  ],
  [
    {
      url: "",
      duration: 15,
      select: false,
      transition: "",
      effect: "",
    },
    {
      url: "",
      duration: 5,
      select: false,
      transition: "",
      effect: "",
    },
    {
      url: "",
      duration: 5,
      select: false,
      transition: "",
      effect: "",
    },
    {
      url: "",
      duration: 5,
      select: false,
      transition: "",
      effect: "",
    },
    {
      url: "",
      duration: 20,
      select: false,
      transition: "",
      effect: "",
    },
  ],
];
// 노래 동기화용 자료형
// const music[]
const router = express.Router();

module.exports = function socketRouter(io) {
  io.on("connection", (socket) => {
    // ===========================입장 & 퇴장 관련 socket===================
    // 입장 : 이전 check 대체
    socket.on("joinRoom", async (data) => {
      try {
        const check = await redis.v4.get(data.roomId);
        if (check === null) {
          io.to(data.Id).emit("welcome", { ans: "NO" });
          return;
        }
        socket.join(data.roomId);
        socket.Id = data.Id;
        socket.roomId = data.roomId;
        // 이거 아이디 왜 넣는거임?
        redis.v4.set(data.Id + "", data.roomId);
        redis.v4.rPush(data.roomId + "/user", data.Id + "");
        redis.v4.expire(`${data.roomId}/user`, 21600)
        console.log("누가 왔어요~", data.roomId, data.Id);
        let AmIFirst = await redis.v4.sendCommand([
          "SET",
          data.roomId + "/playlistPermissionState",
          "true",
          // 개발자모드
          // "NX",
        ]);
        if (AmIFirst === "OK") {
          console.log("첫번쨰 사람 입장!");
        } else {
          console.log("사람하나 추가요~");
        }
      } catch (e) {
        console.log(e);
      }
    });
    // 퇴장 : 전원 퇴장시 이벤트 발생 => 나중에 하고싶은거 넣을 수 있음
    socket.on("disconnect", async () => {
      try {
        if (socket.Id === undefined) {
          return;
        }
        console.log(socket.Id + "님이 나가셨습니다");
        redis.lRem(socket.roomId + "/user", 1, socket.Id);
        redis.v4.del(socket.Id + "");
        const numUserLeft = await redis.v4.lLen(socket.roomId + "/user");
        if (numUserLeft === 0) {
          console.log("방파괴!!!");
          // redis.v4.del(socket.roomId + "");
        }
      } catch (e) {
        console.log(e);
      }
    });

    //===========================playlist 조작 권한 관련 API====================
    socket.on("playlistEditRequest", async (data) => {
      try {
        const oldplaylistPermissionState = await new Promise(
          (resolve, reject) => {
            redis.getset(
              data.roomId + "/playlistPermissionState",
              "false",
              (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
            redis.v4.expire(`${data.roomId}/playlistPermissionState`, 21600)
          }
        );
        console.log("요청왔어요~");
        if (oldplaylistPermissionState === "true") {
          socket
            .to(data.roomId)
            .emit("playlistEditResponse", { state: 2, isChanged: false });
          io.to(data.Id).emit("playlistEditResponse", {
            state: 1,
            isChanged: false,
          });
        } else {
          io.to(data.Id).emit("playlistEditResponse", {
            state: 2,
            isChanged: false,
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("playlistEditFinished", async (data) => {
      try {
        console.log("편집끝났데요~");
        await redis.v4.set(data.roomId + "/playlistPermissionState", "true");
        await redis.v4.expire(`${data.roomId}/playlistPermissionState`, 21600)
        let playlist = JSON.parse(
          await redis.v4.get(`${data.roomId}/playlist`)
        );
        let isChanged = false;
        if (playlist != null) {
          playlist.forEach((value, i) => {
            if (value.select === true) {
              playlist[i].select = false;
              isChanged = true;
            }
          });
        } else {
          playlist = [];
        }
        socket
          .to(data.roomId)
          .emit("playlistEditResponse", { state: 0, playlist, isChanged });
        io.to(data.Id).emit("playlistEditResponse", {
          state: 0,
          playlist,
          isChanged,
        });
        if (isChanged) {
          await redis.v4.set(
            `${data.roomId}/playlist`,
            JSON.stringify(playlist)
          );
          await redis.v4.expire(`${roomid}/playlist`, 21600)
        }
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("speakingState", (data) => {
      socket.to(data.roomId).emit("speakingState", data);
    });
  });
  return router;
};
