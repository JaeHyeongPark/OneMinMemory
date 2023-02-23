// socket.io 라우터
const express = require("express");
const router = express.Router();
const app = express();
// socket IO용 모듈 import
const socketio = require("socket.io");
const http = require("http");
// express 기반 http server 생성과 socket 연결
const httpServer = http.createServer(app);
const redis = require("./RedisClient");

const Output_router = require("./Output-Router");

// 노래 동기화용 자료형
// const music[]

module.exports = function (io) {
  router.io = io;
  router.io.on("connection", (socket) => {
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
        redis.v4.set(data.Id + "", data.roomId);
        redis.v4.rPush(data.roomId + "/user", data.Id + "");
        console.log("누가 왔어요~", data.roomId, data.Id);
        let AmIFirst = await redis.v4.sendCommand([
          "SET",
          data.roomId + "/playlistPermissionState",
          "true",
          "NX",
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
          redis.v4.del(socket.roomId + "");
        }
      } catch (e) {
        console.log(e);
      }
    });
    //============================업로드 관련 socket======================
    // upload 동기화
    socket.on("pictureUpload", (data) => {
      socket
        .to(data.roomId)
        .emit("upload", { uploaderId: data.Id, upimg: data.upimg });
    });
    // 삭제가 부활할지도 모르니 일단 킵
    // socket.on("pictureDelete", (data) => {
    //   socket.to(data.roomId).emit("delete", { deleterId: data.Id });
    // });
    // 수정된 사진 동기화
    socket.on("pictureEdited", (data) => {
      socket
        .to(data.roomId)
        .emit("edit", { editorId: data.Id, editedUrl: data.editedUrl });
    });
    //=========================== playlist 조작 동기화 socket ====================
    // 기본 : effect 적용&삭제, transition 적용&삭제, 사진 삽입 포함
    socket.on("playlistChangedBasic", (data) => {
      socket
        .to(data.roomId)
        .emit("playlistChangedBasic", { playlist: data.playlist });
    });
    // 삭제
    socket.on("playlistChangeDelete", (data) => {
      socket
        .to(data.roomId)
        .emit("playlistChangeDelete", { playlist: data.playlist });
    });
    // 클릭 : 위치 변경 포함
    socket.on("playlistChangeClick", (data) => {
      socket.to(data.roomId).emit("playlistChangeClick", data);
    });
    // 사진 시간 수장
    socket.on("playlistChangedTime", (data) => {
      socket.to(data.roomId).emit("playlistChangedTime", data);
    });
    // 음악과 프리셋 설정
    socket.on("playlistpreset", (data) => {
      let playlist = Output_router.presets[data.idx];
      socket
        .to(data.roomId)
        .emit("playlistpreset", { playlist, src: data.src });
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
        }
      } catch (e) {
        console.log(e);
      }
    });
    // ================================음악과 프리셋============================
    // socket.on("playlistpreset", async (data) => {
    //   try {
    //     const idx = data.idx;

    //     playlist = JSON.parse(JSON.stringify(presets[idx]));
    //     await redis.v4.set(data.roomId + "/playlist", JSON.stringify(playlist));
    //     console.log(data.Id, playlist);
    //     socket.to(data.roomId).emit("playlistChanged", { playlist });
    //     io.to(data.Id).emit("playlistChanged", { playlist });
    //     socket.to(data.roomId).emit("preset", {
    //       selectedMusicSrc: data.selectedMusicSrc,
    //       selectedMusicIdx: data.selectedMusicIdx,
    //     });
    //   } catch (e) {
    //     console.log(e);
    //   }
    // });

    //==================================playlist 조작 메서드=============================
    // 사진에 효과 추가
    socket.on("effect", async (data) => {
      try {
        let playlist = JSON.parse(
          await redis.v4.get(data.roomId + "/playlist")
        );
        const effect = data.effect;
        const idx = data.idx;
        playlist[idx].effect = effect;
        await redis.v4.set(data.roomId + "/playlist", JSON.stringify(playlist));
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
      } catch (e) {
        console.log(e);
      }
    });
    // 사진 사이에 효과 추가
    socket.on("transition", async (data) => {
      try {
        let playlist = JSON.parse(
          await redis.v4.get(data.roomId + "/playlist")
        );
        const transition = data.transition;
        const idx = data.idx;
        playlist[idx].transition = transition;
        await redis.v4.set("testroom/playlist", JSON.stringify(playlist));
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
      } catch (e) {
        console.log(e);
      }
    });
    // 재생목록 효과 제거
    socket.on("delTransition", async (data) => {
      try {
        let playlist = JSON.parse(
          await redis.v4.get(data.roomId + "/playlist")
        );
        const idx = data.idx;
        playlist[idx].transition = "";
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
        await redis.v4.set(data.roomId + "/playlist", JSON.stringify(playlist));
      } catch (e) {
        console.log(e);
      }
    });
    // 재생목록 사진 추가
    socket.on("postplaylist", async (data) => {
      try {
        let playlist = JSON.parse(
          await redis.v4.get(data.roomId + "/playlist")
        );
        const url = data.url;
        const idx = data.idx;
        playlist[idx].url = url;
        await redis.v4.set(data.roomId + "/playlist", JSON.stringify(playlist));
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
      } catch (e) {
        console.log(e);
      }
    });
    // 삭제 이벤트 해당 객체 삭제
    socket.on("deleteplayurl", async (data) => {
      try {
        let playlist = JSON.parse(
          await redis.v4.get(data.roomId + "/playlist")
        );
        const idx = data.idx;
        playlist = playlist.filter((element, i) => {
          if (idx !== i) {
            return element;
          }
        });
        await redis.v4.set(data.roomId + "/playlist", JSON.stringify(playlist));
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
      } catch (e) {
        console.log(e);
      }
    });
    // 클릭 핸들링
    socket.on("clicking", async (d) => {
      try {
        let playlist = JSON.parse(await redis.v4.get(d.roomId + "/playlist"));
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
          await redis.v4.set(
            data.roomId + "/playlist",
            JSON.stringify(playlist)
          );
          socket.to(d.roomId).emit("playlistChanged", { playlist });
          io.to(d.Id).emit("clicking", { playlist });
        } else if (playlist[idx].select) {
          playlist[idx].select = false;
          await redis.v4.set(
            data.roomId + "/playlist",
            JSON.stringify(playlist)
          );
          socket.to(d.roomId).emit("playlistChanged", { playlist });
          io.to(d.Id).emit("clicking", { playlist });
        } else {
          playlist[idx].select = true;
          await redis.v4.set(
            data.roomId + "/playlist",
            JSON.stringify(playlist)
          );
          io.to(d.Id).emit("clicking", {
            playlist,
            idx,
            time: time,
            duration: playlist[idx].duration,
            totaltime: totaltime,
          });
        }
      } catch (e) {
        console.log(e);
      }
    });
    // 재생목록에 프리셋이 아닌 공간에 새로운 사진을 추가
    socket.on("inputnewplay", async (data) => {
      try {
        const url = data.url;
        const newimage = {
          url: url,
          duration: 5,
          select: false,
          transition: "",
        };

        let playlist = JSON.parse(
          await redis.v4.get(data.roomId + "/playlist")
        );
        if (playlist === null) {
          playlist = [];
        }
        playlist.push(newimage);
        await redis.v4.set(data.roomId + "/playlist", JSON.stringify(playlist));

        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("playlistChanged", { playlist });
      } catch (e) {
        console.log(e);
      }
    });
    // 이미지 재생 시간 변경
    socket.on("changetime", async (data) => {
      try {
        let playlist = JSON.parse(
          await redis.v4.get(data.roomId + "testroom/playlist")
        );
        const idx = data.idx;
        const time = data.time;
        await redis.v4.set(data.roomId + "/playlist", JSON.stringify(playlist));
        socket.to(data.roomId).emit("playlistChanged", { playlist });
        io.to(data.Id).emit("changetime", {
          playlist,
          idx,
          DT: playlist[idx].duration,
        });
      } catch (e) {
        console.log(e);
      }
    });
  });
  return router;
};
