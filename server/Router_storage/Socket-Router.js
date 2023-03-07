const socketio = require("socket.io");
const redis = require("./RedisClient");
const express = require("express");
const router = express.Router();

module.exports = function socketRouter(io) {
  io.on("connection", (socket) => {
    // ===========================입장 & 퇴장 관련 socket===================
    // 입장 : 이전 check 대체
    socket.on("joinRoom", async (data) => {
      try {
        const playlistPermissionState = await redis.v4.get(
          data.roomId + "/playlistPermissionState"
        );
        if (playlistPermissionState === null) {
          io.to(data.Id).emit("welcome", { ans: "NO" });
          return;
        }
        if (playlistPermissionState === "false") {
          state = 2;
        } else {
          state = 0;
        }
        socket.join(data.roomId);
        socket.Id = data.Id;
        socket.roomId = data.roomId;
        // 이거 아이디 왜 넣는거임? => 뺼꺼임=> 다시 넣음
        let numUsers = await redis.v4.sendCommand([
          "incr",
          data.roomId + "/numUser",
        ]);
        await redis.v4.expire(data.roomId + "/numUser", 21600);
        let renderVoteState = await redis.v4.get(
          data.roomId + "/renderVoteState"
        );
        socket.to(data.roomId).emit("someoneCame", { numUsers });
        io.to(data.Id).emit("welcome", {
          renderVoteState,
          playlistPermissionState: state,
          numUsers,
        });
        console.log("누가 왔어요~", data.roomId, data.Id);
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
        let numUserLeft = await redis.v4.sendCommand([
          "decr",
          socket.roomId + "/numUser",
        ]);
        if (numUserLeft != 0) {
          redis.v4.expire(socket.roomId + "/numUser", 21600);
        }
        let permissionUesr = await redis.v4.get(
          socket.roomId + "playlistPermissionState"
        );
        let status = -1;
        if (permissionUesr === socket.Id) {
          await redis.v4.sendCommand([
            "SET",
            socket.roomId + "playlistPermissionState",
            "true",
            "EX",
            "21600",
          ]);
          status = 0;
        }
        let myVoteState = await redis.v4.get(socket.Id + "/renderVoteState");
        let renderVoteState;
        if (myVoteState === "true") {
          renderVoteState = await redis.v4.sendCommand([
            "decr",
            socket.roomId + "/renderVoteState",
          ]);
          redis.v4.expire(socket.roomId + "/renderVoteState", 21600);
        } else {
          renderVoteState = await redis.v4.get(
            socket.roomId + "/renderVoteState"
          );
        }
        socket.to(socket.roomId).emit("welcome", {
          playlistPermissionState: status,
          numUsers: numUserLeft,
          renderVoteState,
        });
        if (numUserLeft === 0) {
          console.log("방파괴!!!");
          // redis.v4.del(socket.roomId + "");
        }
      } catch (e) {
        console.log(e);
      }
    });
    // =======================rendering vote 관련 socket=====================
    socket.on("IVoted", async (data) => {
      try {
        let renderVoteState;
        if (data.voteState === true) {
          renderVoteState = await redis.v4.sendCommand([
            "incr",
            data.roomId + "/renderVoteState",
          ]);
          redis.v4.expire(data.roomId + "/numUser", 21600);
          await redis.v4.sendCommand([
            "SET",
            data.Id + "/renderVoteState",
            "true",
            "EX",
            "21600",
          ]);
        } else {
          renderVoteState = await redis.v4.sendCommand([
            "decr",
            data.roomId + "/renderVoteState",
          ]);
          redis.v4.expire(data.roomId + "/renderVoteState", 21600);
          await redis.v4.sendCommand([
            "SET",
            data.Id + "/renderVoteState",
            "false",
            "EX",
            "21600",
          ]);
        }
        io.to(data.roomId).emit("someoneVoted", { renderVoteState });
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("resetMyVoteState", (data) => {
      redis.v4.sendCommand([
        "SET",
        data.Id + "/renderVoteState",
        "false",
        "EX",
        "21600",
      ]);
    });
    //===========================playlist 조작 권한 관련 API====================
    socket.on("playlistEditRequest", async (data) => {
      try {
        const oldplaylistPermissionState = await new Promise(
          (resolve, reject) => {
            redis.getset(
              data.roomId + "/playlistPermissionState",
              data.Id,
              (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
            redis.v4.expire(`${data.roomId}/playlistPermissionState`, 21600);
          }
        );
        console.log("요청왔어요~");
        if (oldplaylistPermissionState !== "false") {
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
        await redis.v4.sendCommand([
          "SET",
          data.roomId + "/playlistPermissionState",
          "true",
          "EX",
          "21600",
        ]);
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
          await redis.v4.sendCommand([
            "SET",
            `${data.roomId}/playlist`,
            JSON.stringify(playlist),
            "EX",
            "21600",
          ]);
        }
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("speakingState", (data) => {
      socket.to(data.roomId).emit("speakingState", data);
    });
    // ===========================작업중인 사진 공유 ======================
    socket.on("myCanvas", (data) => {
      socket
        .to(socket.roomId)
        .emit("myCanvas", { ...data, senderId: socket.Id });
    });
  });
  return router;
};
