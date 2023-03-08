const socketio = require("socket.io");
const redis = require("./RedisClient");
const express = require("express");
const router = express.Router();
const ffmpegRouter = require("./FFmpeg-Router");

module.exports = function socketRouter(io) {
  io.on("connection", (socket) => {
    // ===========================입장 & 퇴장 관련 socket===================
    // 입장 : 이전 check 대체
    socket.on("joinRoom", async (data) => {
      try {
        let numUsers = await redis.v4.incr(data.roomId + "/numUser");
        if (numUsers > 5) {
          await redis.v4.decr(data.roomId + "/numUser");
          io.to(data.Id).emit("welcome", { ans: "NO", reason: "full" });
          return;
        }
        await redis.v4.expire(data.roomId + "/numUser", 21600);
        const playlistPermissionState = await redis.v4.get(
          data.roomId + "/playlistPermissionState"
        );
        if (playlistPermissionState === null) {
          io.to(data.Id).emit("welcome", { ans: "NO" });
          return;
        }
        if (playlistPermissionState !== "true") {
          state = 2;
        } else {
          state = 0;
        }
        socket.join(data.roomId);
        socket.Id = data.Id;
        socket.roomId = data.roomId;

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

        let numUserLeft = await redis.v4.decr(socket.roomId + "/numUser");
        if (numUserLeft != 0) {
          redis.v4.expire(socket.roomId + "/numUser", 21600);
        }
        let permissionUser = await redis.v4.get(
          socket.roomId + "playlistPermissionState"
        );
        let status = -1;
        if (permissionUser === socket.Id) {
          await redis.v4.set(socket.roomId + "playlistPermissionState", "true");
          await redis.v4.expire(
            socket.roomId + "playlistPermissionState",
            21600
          );
          status = 0;
        }
        let myVoteState = await redis.v4.get(socket.Id + "/renderVoteState");
        let renderVoteState;
        if (myVoteState === "true") {
          renderVoteState = await redis.v4.decr(
            socket.roomId + "/renderVoteState"
          );
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
        }
      } catch (e) {
        console.log(e);
      }
    });
    // =======================rendering vote 관련 socket=====================
    socket.on("IVoted", async (data) => {
      try {
        let renderVoteState;
        let numUser = await redis.v4.get(data.roomId + "/numUser");
        if (data.voteState === true) {
          renderVoteState = await redis.v4.incr(
            data.roomId + "/renderVoteState"
          );
          redis.v4.expire(data.roomId + "/renderVoteState", 21600);
          await redis.v4.set(data.Id + "/renderVoteState", "true");
          await redis.v4.expire(data.Id + "/renderVoteState", 21600);
        } else {
          renderVoteState = await redis.v4.decr(
            data.roomId + "/renderVoteState"
          );
          redis.v4.expire(data.roomId + "/renderVoteState", 21600);

          await redis.v4.set(data.Id + "/renderVoteState", "false");
          await redis.v4.expire(data.Id + "/renderVoteState", 21600);
        }
        io.to(data.roomId).emit("someoneVoted", { renderVoteState });
        console.log(numUser, renderVoteState);
        if (Number(numUser) === Number(renderVoteState)) {
          ffmpegRouter(data.roomId, io);
        }
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("resetMyVoteState", async (data) => {
      await redis.v4.set(data.Id + "/renderVoteState", "false");
      await redis.v4.expire(data.Id + "/renderVoteState", 21600);
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
          }
        );
        if (oldplaylistPermissionState === "true") {
          socket
            .to(data.roomId)
            .emit("playlistEditResponse", { state: 2, isChanged: false });
          io.to(data.Id).emit("playlistEditResponse", {
            state: 1,
            isChanged: false,
          });
        } else {
          await redis.v4.set(
            data.roomId + "/playlistPermissionState",
            oldplaylistPermissionState
          );
          io.to(data.Id).emit("playlistEditResponse", {
            state: 2,
            isChanged: false,
          });
        }
        console.log(oldplaylistPermissionState);
        redis.v4.expire(`${data.roomId}/playlistPermissionState`, 21600);
      } catch (e) {
        console.log(e);
      }
    });
    socket.on("playlistEditFinished", async (data) => {
      try {
        console.log("편집끝났데요~");

        await redis.v4.set(data.roomId + "/playlistPermissionState", "true");
        await redis.v4.expire(data.roomId + "/playlistPermissionState", 21600);
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
          await redis.v4.expire(`${data.roomId}/playlist`, 21600);
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
