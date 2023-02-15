// alert("hi");

const id = 2;

const socket = io();

// 비디오 관리 버튼
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");
const quitBtn = document.getElementById("quit");

// 방에 입장전엔 welcome태그 활성화 방에 입장 후엔 call 태그 활성화
const welcome = document.getElementById("welcome");
const call = document.getElementById("call");
// 대화방을 일단 숨겨둠
call.hidden = true;

// RTC 연결 생성 변수 (추가 설명 필요)
const RTC_config = {
  iceServers: [
    // {
    //   urls: 'stun:[STUN_IP]:[PORT]',
    //   'credentials': '[YOR CREDENTIALS]',
    //   'username': '[USERNAME]'
    // },
    {
      urls: "stun:stun.l.google.com:19302",
    },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    {
      urls: [
        "stun:13.125.11.187:3478",
        "turn:13.125.11.187:3478?transport=udp",
      ],
      username: "choongil",
      credential: "Lee",
      // iceCandidatePoolSize: 100,
    },
    {
      urls: ["stun:3.38.151.56", "turn:3.38.151.56:3478?transport=udp"],
      username: "choongil",
      credential: "Lee",
      // iceCandidatePoolSize: 100,
    },
  ],
};

// 내 비디오가 송출되는 태그
const myFace = document.getElementById("myFace");

// 친구들 얼굴이 송출되는 태그
const peersFace1 = document.getElementById("peersFace1");
const peersFace2 = document.getElementById("peersFace2");
const peersFace3 = document.getElementById("peersFace3");
const peersFace4 = document.getElementById("peersFace4");

// 수신되는 비디오를 틀어줄 태그들을 관리할 리스트
const videos = [
  {
    videoTag: peersFace1,
    isConnected: false,
  },
  {
    videoTag: peersFace2,
    isConnected: false,
  },
  {
    videoTag: peersFace3,
    isConnected: false,
  },
  {
    videoTag: peersFace4,
    isConnected: false,
  },
];

// streamId to user
let streamIdToUser = {};

// userId to streamId & video
let userInfo = {};

// 내 stream을 송출하기 위한 connection
let sendingConnection;

// 내 비디오를 관리하는 변수들
let myStream;
let mute = false;
let cameraOff = false;
let roomId;

// 카메라를 가져오는 함수, 카메라들을 조회하며 카메라 선택 input도 관리한다.
async function getCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((devices) => devices.kind === "videoinput");
    // 지금 진행중인 비디오 트랙에 대한 정보를 확인할 수 있는 함수
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

// 유저의 스트림을 생성하고 비디오 태그에 연결하는 함수
async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: {
      width: 320,
      height: 240,
      frameRate: { max: 14 },
      facingMode: "user",
    },
  };
  const cameraConstraints = {
    audio: true,
    video: {
      width: 320,
      height: 240,
      frameRate: { max: 14 },
      deviceId: { exact: deviceId },
    },
  };
  try {
    // 유저의 유저미디어의 stream을 주는 api
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    );
    // console.log(deviceId);
    let myVideo = new MediaStream();
    myVideo.addTrack(myStream.getVideoTracks()[0]);
    myFace.srcObject = myVideo;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}

//-------------- 버튼 관리-------------------
// mute 버튼
function handleMuteBtn() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!mute) {
    muteBtn.innerText = "Unmute";
    mute = true;
  } else {
    muteBtn.innerText = "Mute";
    mute = false;
  }
}

// cameraOff 버튼
function handleCameraBtn() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "camera OFF";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "camera ON";
    cameraOff = true;
  }
}
// 카메라 전환 버튼
async function handleCameraChange() {
  await getMedia(cameraSelect.value);
  if (sendingConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = sendingConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
}
// 나가기 버튼
function handleQuit() {
  socket.emit("quit", roomId, id);
  window.location.reload();
}
quitBtn.addEventListener("click", handleQuit);
muteBtn.addEventListener("click", handleMuteBtn);
cameraBtn.addEventListener("click", handleCameraBtn);
cameraSelect.addEventListener("input", handleCameraChange);
// -----------------------------------------

//-------------------방에 입장 & 입장하자마자 시작하는 함수----------------------

// 방에 들어오면 실행되는 함수
// 1. 자신의 스트림을 만든다
// 2. 자신의 스트림을 서버로 보내줄 연결을 만든다.
async function startMedia() {
  welcome.hidden = true;
  call.hidden = false;
  // 미디어를 셋팅하고 peer to peer 연결을 시작해야 하므로 promise함수가 섞인 getMedia()를 await으로 기다린다.
  await getMedia();
  await makeSendingConection();
}

// 방에 입장할 때 입장 코드를 입력, 전송하는 함수
// 아래와 같은 방법으로 소캣에 대한 응답이 완료되었을 때 실행되는 함수를 넣어준다.
const welcomeForm = welcome.querySelector("form");
async function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  roomId = input.value;
  input.value = "";
  await startMedia();
}
welcomeForm.addEventListener("submit", handleWelcomeSubmit);
// -------------------------------------------------------

// -----------------socket code-----------------------

// 서버에서 sendingConnection에 대한 answer을 주는 소켓
socket.on("welcome", async (answer) => {
  try {
    await sendingConnection.setRemoteDescription(answer);
    console.log("answer입력완료");
  } catch (e) {
    console.log(e);
  }
});

socket.on("iceForSending", async (data) => {
  if (sendingConnection.remoteDescription != null) {
    console.log("i got ice for sending!");
    await sendingConnection.addIceCandidate(data.ice);
  }
});

// 새로운 사용자 들어왔을 때 실행되는 소캣
socket.on("makeNewPeer", (data) => {
  console.log(sendingConnection.connectionState);
  // console.log(data.streamId);
  console.log("새로운 친구가 왔을 때 사용되는 소캣");
  streamIdToUser[data.streamId] = data.senderId;
  userInfo[data.senderId] = {};
  userInfo[data.senderId].streamId = data.streamId;
  let i = 0;
  while (i < 4) {
    if (videos[i].isConnected === false) {
      videos[i].isConnected = true;
      userInfo[data.senderId].video = videos[i];
      break;
    }
    i++;
  }
  socket.emit("readyForGettingStream", {
    roomId,
    receiverId: socket.id,
    senderId: data.senderId,
  });
});

// 서버가 보낸 nego 요청
socket.on("handleNegotiation", async (data) => {
  try {
    sendingConnection.setRemoteDescription(data.offer);
    let answer = await sendingConnection.createAnswer();
    await sendingConnection.setLocalDescription(answer);
    socket.emit("answerForNegotiation", {
      roomId,
      answer,
      receiverId: socket.id,
    });
  } catch (e) {
    console.log(e);
  }
});

// 서버가 보낸 다른사람의 재연결 정보
socket.on("someoneReconnected", (data) => {
  streamIdToUser[data.streamId] = data.senderId;
  userInfo[data.senderId].streamId = data.streamId;
  socket.emit("readyForGettingStream", {
    roomId,
    receiverId: socket.id,
    senderId: data.senderId,
  });
});

// 누군가 나갔음을 알리는 소캣
socket.on("someoneLeft", (data) => {
  console.log(data.senderId);
  userInfo[data.senderId].video.isConnected = false;
  userInfo[data.senderId].video.videoTag.srcObject = null;
  streamIdToUser[userInfo[data.senderId].streamId] = null;
  userInfo[data.senderId].streamId = null;
});

// 내가 보낸 negotiation의 서버로부터 온 답장
socket.on("answerForNegotiation", async (data) => {
  try {
    await sendingConnection.setRemoteDescription(data.answer);
  } catch (e) {
    console.log(e);
  }
});

// ---------------------RTC 코드------------------------

// 입장 시 호출되는 sendingConnection과 offer을 생성하여 return하는 함수
async function makeSendingConection() {
  try {
    sendingConnection = new RTCPeerConnection(RTC_config);
    sendingConnection.addEventListener("icecandidate", (data) => {
      if (data.candidate != null) {
        socket.emit("iceForSending", {
          ice: data.candidate,
          Id: socket.id,
          roomId,
        });
        console.log("i got sending Ice and sent to server");
      }
    });

    sendingConnection.addEventListener("connectionstatechange", (unused) => {
      if (sendingConnection.connectionState === "disconnected") {
        sendingConnection.close();
        makeNewConnection();
      }
    });

    // 내가 받을 때만 의미가 있는 이벤트 리스너라 일단 비활성
    sendingConnection.addEventListener("track", (data) => {
      console.log("트랙이벤트 발생");
      // console.log(data, data.streams[0].id);
      let userId = streamIdToUser[data.streams[0].id];
      userInfo[userId].video.videoTag.srcObject = data.streams[0];
    });

    // 스트림 내에 모든 트랙들을 접근하는 함수를 이용하여 myPeercon
    myStream.getTracks().forEach((track) => {
      sendingConnection.addTrack(track, myStream);
    });

    // SendingConnection을 위한 offer 생성 후 서버에 전달
    const sendingOffer = await sendingConnection.createOffer();
    await sendingConnection.setLocalDescription(sendingOffer);
    socket.emit("joinRoom", {
      roomId,
      sendingOffer: sendingOffer,
      Id: socket.id,
    });
  } catch (e) {
    console.log(e);
  }
}

// 연결이 disconnected되었을 떄 실행되는 함수 : 새로운 연결 생성
async function makeNewConnection() {
  try {
    console.log("새로 연결 시도!");
    sendingConnection = new RTCPeerConnection(RTC_config);
    sendingConnection.addEventListener("icecandidate", (data) => {
      if (data.candidate != null) {
        socket.emit("iceForSending", {
          ice: data.candidate,
          Id: socket.id,
          roomId,
        });
        console.log("i got sending Ice and sent to server");
      }
    });

    sendingConnection.addEventListener("connectionstatechange", (unused) => {
      if (sendingConnection.connectionState === "disconnected") {
        sendingConnection.close();
        makeNewConnection();
      }
    });

    // 내가 받을 때만 의미가 있는 이벤트 리스너라 일단 비활성
    sendingConnection.addEventListener("track", (data) => {
      console.log("트랙이벤트 발생");
      let userId = streamIdToUser[data.streams[0].id];
      userInfo[userId].video.videoTag.srcObject = data.streams[0];
    });

    // 스트림 내에 모든 트랙들을 접근하는 함수를 이용하여 myPeercon
    myStream.getTracks().forEach((track) => {
      sendingConnection.addTrack(track, myStream);
    });

    // SendingConnection을 위한 offer 생성 후 서버에 전달
    const sendingOffer = await sendingConnection.createOffer();
    await sendingConnection.setLocalDescription(sendingOffer);
    socket.emit("reconnectOffer", {
      roomId,
      sendingOffer: sendingOffer,
      Id: socket.id,
    });
  } catch (e) {
    console.log(e);
  }
}
