const express = require("express");
const redis = require("./RedisClient");
const router = express.Router();

module.exports = function (io) {
  const presets = [
    [],
    [
      {
        url: "",
        duration: 3,
        select: false,
        transition: "fadeblack",
        effect: "ZoomOut_Center",
      },
      {
        url: "",
        duration: 4,
        select: false,
        transition: "",
        effect: "ZoomIn_TopRight",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomOut_BottomRight",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "fadewhite",
        effect: "ZoomIn_Center",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomIn_TopLeft",
      },
      {
        url: "",
        duration: 4,
        select: false,
        transition: "",
        effect: "ZoomIn_Center",
      },
      {
        url: "",
        duration: 4,
        select: false,
        transition: "dissolve",
        effect: "ZoomOut_Center",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomIn_TopRight",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "",
      },
      {
        url: "",
        duration: 4,
        select: false,
        transition: "",
        effect: "ZoomOut_TopRight",
      },
    ],
    [
      {
        url: "",
        duration: 3,
        select: false,
        transition: "fadeblack",
        effect: "ZoomOut_Center",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomIn_TopRight",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomOut_BottomRight",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "fadewhite",
        effect: "ZoomIn_Center",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomIn_TopLeft",
      },
      {
        url: "",
        duration: 4,
        select: false,
        transition: "",
        effect: "ZoomIn_Center",
      },
      {
        url: "",
        duration: 4,
        select: false,
        transition: "dissolve",
        effect: "ZoomOut_Center",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomIn_TopRight",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "diagtl",
        effect: "ZoomIn_BottomRight",
      },
      {
        url: "",
        duration: 4,
        select: false,
        transition: "",
        effect: "ZoomOut_TopRight",
      },
    ],
    [
      {
        url: "",
        duration: 3,
        select: false,
        transition: "dissolve",
        effect: "ZoomIn_TopLeft",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomOut_TopLeft",
      },
      {
        url: "",
        duration: 1,
        select: false,
        transition: "",
        effect: "ZoomIn_Center",
      },
      {
        url: "",
        duration: 1,
        select: false,
        transition: "",
        effect: "ZoomIn_BottomRight",
      },
      {
        url: "",
        duration: 1,
        select: false,
        transition: "",
        effect: "ZoomOut_Center",
      },
      {
        url: "",
        duration: 2,
        select: false,
        transition: "fadeblack",
        effect: "ZoomIn_Center",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomIn_Center",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomOut_BottomRight",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "fadewhite",
        effect: "ZoomIn_Center",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomIn_TopLeft",
      },
      {
        url: "",
        duration: 2,
        select: false,
        transition: "",
        effect: "ZoomIn_Center",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "dissolve",
        effect: "ZoomOut_Center",
      },
      {
        url: "",
        duration: 3,
        select: false,
        transition: "",
        effect: "ZoomIn_TopRight",
      },
      {
        url: "",
        duration: 2,
        select: false,
        transition: "diagtl",
        effect: "ZoomIn_Center",
      },
      {
        url: "",
        duration: 5,
        select: false,
        transition: "",
        effect: "ZoomOut_TopRight",
      },
      {
        url: "",
        duration: 4,
        select: false,
        transition: "",
        effect: "",
      },
      {
        url: "",
        duration: 8,
        select: false,
        transition: "",
        effect: "ZoomOut_Center",
      },
    ],
  ];

  // effect효과 playlist에 넣기
  router.post("/effect", async (req, res, next) => {
    const roomid = req.body.roomid;
    const playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
    const { effect, idx } = req.body;

    playlist[idx].effect = effect;

    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    await redis.v4.expire(`${roomid}/playlist`, 21600);
    res.send({ success: true });

    io.to(roomid).emit("playlistChangedBasic", { playlist });
  });

  // effect 지우기
  router.post("/deleffect", async (req, res, next) => {
    const roomid = req.body.roomid;
    const playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
    const idx = req.body.idx;

    playlist[idx].effect = "";

    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    await redis.v4.expire(`${roomid}/playlist`, 21600);
    res.send({ success: true });
    io.to(roomid).emit("playlistChangedBasic", { playlist });
  });

  // transition효과 playlist에 넣기
  router.post("/transition", async (req, res, next) => {
    const roomid = req.body.roomid;
    let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));

    const transition = req.body.transition;
    const idx = req.body.idx;
    playlist[idx].transition = transition;

    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    await redis.v4.expire(`${roomid}/playlist`, 21600);
    res.send({ success: true });
    io.to(roomid).emit("playlistChangedBasic", { playlist });
  });

  // 클릭으로 transition 지우기(해당 인덱스만)
  router.post("/deltransition", async (req, res, next) => {
    const roomid = req.body.roomid;
    let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));

    const idx = req.body.idx;
    playlist[idx].transition = "";

    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    await redis.v4.expire(`${roomid}/playlist`, 21600);
    res.send({ success: true });
    io.to(roomid).emit("playlistChangedBasic", { playlist });
  });

  // 재생목록 호출 API
  router.post("/getplaylist", async (req, res, next) => {
    const roomid = req.body.roomid;
    let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
    if (playlist === null) {
      playlist = [];
    }
    res.send(playlist);
  });

  // 음원 고르면 해당 프리셋과 음파 저장
  router.post("/playlistpreset", async (req, res, next) => {
    const idx = req.body.idx;
    const src = req.body.src;
    const roomid = req.body.roomid;

    playlist = presets[idx];

    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    await redis.v4.expire(`${roomid}/playlist`, 21600);
    await redis.v4.set(`${roomid}/song`, JSON.stringify([idx, src]));
    await redis.v4.expire(`${roomid}/song`, 21600);
    res.send({ success: true });
    io.to(roomid).emit("playlistpreset", { playlist, src, idx });
  });

  // 프리셋에 이미지 넣기
  router.post("/postplaylist", async (req, res, next) => {
    const roomid = req.body.roomid;
    console.log("플레이리스트 사진 요청");

    let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));

    const url = req.body.url;
    const idx = req.body.idx;
    playlist[idx].url = url;

    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    await redis.v4.expire(`${roomid}/playlist`, 21600);

    res.send({ success: true });
    io.to(roomid).emit("playlistChangedBasic", { playlist });
  });

  // 삭제 이벤트 해당 객체 삭제
  router.post("/deleteplayurl", async (req, res, next) => {
    const roomid = req.body.roomid;
    let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
    const idx = req.body.idx;

    playlist = playlist.filter((data, i) => {
      if (idx !== i) {
        return data;
      }
    });

    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    await redis.v4.expire(`${roomid}/playlist`, 21600);
    res.send({ success: true });
    io.to(roomid).emit("playlistChangeDelete", { playlist });
  });

  // 재생목록 click시 이벤트
  router.post("/clickimg", async (req, res, next) => {
    const roomid = req.body.roomid;
    const idx = req.body.idx;

    let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));

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
      await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
      await redis.v4.expire(`${roomid}/playlist`, 21600);
      res.send({ success: true });
      io.to(roomid).emit("playlistChangeClick", { playlist });
    } else if (playlist[idx].select) {
      playlist[idx].select = false;
      await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
      await redis.v4.expire(`${roomid}/playlist`, 21600);
      res.send({ success: true });
      io.to(roomid).emit("playlistChangeClick", { playlist });
    } else {
      playlist[idx].select = true;
      await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
      await redis.v4.expire(`${roomid}/playlist`, 21600);
      res.send({ success: true });
      io.to(roomid).emit("playlistChangeClick", {
        playlist,
        time: time,
        duration: playlist[idx].duration,
        totaltime: totaltime,
        idx,
      });
    }
  });

  // 새로운 사진을 재생목록에 추가(프리셋 말고)
  router.post("/inputnewplay", async (req, res, next) => {
    const roomid = req.body.roomid;
    const url = req.body.url;

    const newimage = {
      url: url,
      duration: 5,
      select: false,
      effect: "",
      transition: "",
    };

    let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
    if (playlist === null) {
      playlist = [];
    }
    playlist.push(newimage);

    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    await redis.v4.expire(`${roomid}/playlist`, 21600);
    res.send({ success: true });
    io.to(roomid).emit("playlistChangedBasic", { playlist });
  });

  // 이미지 재생 시간 변경
  router.post("/changetime", async (req, res, next) => {
    const roomid = req.body.roomid;
    let playlist = JSON.parse(await redis.v4.get(`${roomid}/playlist`));
    const idx = req.body.idx;
    const time = req.body.time;

    playlist[idx].select = false;
    playlist[idx].duration += time;

    await redis.v4.set(`${roomid}/playlist`, JSON.stringify(playlist));
    await redis.v4.expire(`${roomid}/playlist`, 21600);
    res.json({ success: true });
    io.to(roomid).emit("playlistChangedTime", {
      playlist,
      DT: playlist[idx].duration,
    });
  });

  return router;
};
