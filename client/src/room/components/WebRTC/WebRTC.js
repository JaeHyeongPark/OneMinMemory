import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import App from "../../../App";
import "./WebRTC.css";
import { useEffect } from "react";
import { io } from "socket.io-client"; // Client Socket
const socket = io("https://chjungle.shop", {
  path: "/sfusocket",
  withCredentials: true,

  extraHeaders: {
    "my-custom-header": "abcd",
  },
});

let roomId;

// streamId to user
let streamIdToUser = {};

// userId to streamId & video
let userInfo = {};

// 내 stream을 송출하기 위한 connection
let sendingConnection;

// 내 비디오를 관리하는 변수들
let myStream;

// RTC 연결 생성 변수 (추가 설명 필요)
const RTC_config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    {
      urls: [
        "stun:" + process.env.REACT_APP_TurnIP1 + ":3478",
        "turn:" + process.env.REACT_APP_TurnIP1 + ":3478?transport=udp",
      ],
      username: "choongil",
      credential: "Lee",
    },
    {
      urls: [
        "stun:" + process.env.REACT_APP_TurnIP2 + ":3478",
        "turn:" + process.env.REACT_APP_TurnIP2 + ":3478?transport=udp",
      ],
      username: "choongil",
      credential: "Lee",
    },
  ],
};

// 유저의 스트림을 생성하고 비디오 태그에 연결하는 함수
async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: {
      width: 320,
      height: 240,
      codec: "H264",
      frameRate: { max: 14 },
      facingMode: "user",
    },
  };
  try {
    // 유저의 유저미디어의 stream을 주는 api
    myStream = await navigator.mediaDevices.getUserMedia(initialConstrains);
    if (myStream.getVideoTracks().length === 0) {
      return;
    }
    // ==============================자신이 말하고 있을 때 다른사람들에게 알려주기 위한 코드 ====================
    // Create an audio context
    const audioContext = new AudioContext();

    // Get the audio track from the sender stream
    const audioTrack = myStream.getAudioTracks()[0];

    // Create a media stream with the audio track
    const audioStream = new MediaStream([audioTrack]);

    // Create a media stream source node from the audio stream
    const audioSourceNode = audioContext.createMediaStreamSource(audioStream);

    // Create an audio worklet node
    await audioContext.audioWorklet.addModule(
      "../WebRTC/MyAudioWorkletProcessor.js"
    );
    const audioWorkletNode = new AudioWorkletNode(
      audioContext,
      "my-audio-worklet-processor"
    );
    // Connect the audio source node to the audio worklet node
    audioSourceNode.connect(audioWorkletNode);

    // Connect the audio worklet node to the audio context destination
    audioWorkletNode.connect(audioContext.destination);

    // Listen for the "message" event from the audio worklet node
    audioWorkletNode.port.onmessage = (event) => {
      const isSpeaking = event.data.isSpeaking;
      if (isSpeaking) {
        App.mainSocket.emit("speakingState", {
          isSpeaking,
          roomId,
          speakerId: App.mainSocket.id,
        });
      }
    };
    // myStream = await navigator.mediaDevices.getUserMedia(
    //   deviceId ? cameraConstraints : initialConstrains
    // );
    // console.log(deviceId);
    // let myVideo = new MediaStream();
    // myVideo.addTrack(myStream.getVideoTracks()[0]);
    // myFace.srcObject = myVideo;
    // if (!deviceId) {
    //   await getCameras();
    // }
  } catch (e) {
    console.log(e);
  }
}

// mute 버튼
function handleMuteBtn() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
}
// cameraOff 버튼
function handleCameraBtn() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
}

// 친구들 얼굴이 송출되는 태그
let peersFace1, peersFace2, peersFace3, peersFace4;

let videoFrame1, videoFrame2, videoFrame3, videoFrame4;
let imgTag1, imgTag2, imgTag3, imgTag4;
// 수신되는 비디오를 틀어줄 태그들을 관리할 리스트
let videos;

// 방에 들어오면 실행되는 함수
// 1. 자신의 스트림을 만든다
// 2. 자신의 스트림을 서버로 보내줄 연결을 만든다.
async function startMedia() {
  // 미디어를 셋팅하고 peer to peer 연결을 시작해야 하므로 promise함수가 섞인 getMedia()를 await으로 기다린다.
  await getMedia();
  await makeSendingConection();
}

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

let initialSet = false;

// 새로운 사용자 들어왔을 때 실행되는 소캣
socket.on("makeNewPeer", (data) => {
  console.log(sendingConnection.connectionState);
  console.log("새로운 친구가 왔을 때 사용되는 소캣");
  streamIdToUser[data.streamId] = data.senderId;
  userInfo[data.senderId] = {};
  userInfo[data.senderId].streamId = data.streamId;
  let i = 0;
  while (i < 4) {
    if (videos[i].isConnected === false) {
      console.log("여기");
      videos[i].isConnected = true;
      userInfo[data.senderId].video = videos[i];
      break;
    }
    i++;
  }
  socket.emit("readyForGettingStream", {
    roomId,
    receiverId: App.mainSocket.id,
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
      receiverId: App.mainSocket.id,
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
    receiverId: App.mainSocket.id,
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
          Id: App.mainSocket.id,
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

    let senders = sendingConnection.getSenders();
    let videoSender = senders.find((sender) => sender.track.kind === "video");
    let parameters = videoSender.getParameters();
    parameters.encodings[0].maxBitrate = 300000;
    videoSender.setParameters(parameters);

    // SendingConnection을 위한 offer 생성 후 서버에 전달
    const sendingOffer = await sendingConnection.createOffer();
    await sendingConnection.setLocalDescription(sendingOffer);
    console.log("오퍼 보낼께요~");
    socket.emit("joinRoom", {
      roomId,
      sendingOffer: sendingOffer,
      Id: App.mainSocket.id,
      RTCId: socket.id,
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
          Id: App.mainSocket.id,
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
      Id: App.mainSocket.id,
    });
  } catch (e) {
    console.log(e);
  }
}
// 태그들을 자료형에 매핑하는 함수
const initializeSetting = () => {
  peersFace1 = document.getElementById("peersFace1");
  peersFace2 = document.getElementById("peersFace2");
  peersFace3 = document.getElementById("peersFace3");
  peersFace4 = document.getElementById("peersFace4");
  videoFrame1 = document.getElementById("videoFrame1");
  videoFrame2 = document.getElementById("videoFrame2");
  videoFrame3 = document.getElementById("videoFrame3");
  videoFrame4 = document.getElementById("videoFrame4");
  imgTag1 = document.getElementById("imgTag1");
  imgTag2 = document.getElementById("imgTag2");
  imgTag3 = document.getElementById("imgTag3");
  imgTag4 = document.getElementById("imgTag4");
  videos = [
    {
      imgTag: imgTag1,
      videoFrame: videoFrame1,
      videoTag: peersFace1,
      isConnected: false,
    },
    {
      imgTag: imgTag2,
      videoFrame: videoFrame2,
      videoTag: peersFace2,
      isConnected: false,
    },
    {
      imgTag: imgTag3,
      videoFrame: videoFrame3,
      videoTag: peersFace3,
      isConnected: false,
    },
    {
      imgTag: imgTag4,
      videoFrame: videoFrame4,
      videoTag: peersFace4,
      isConnected: false,
    },
  ];
  initialSet = true;
};
const WebRTC = () => {
  roomId = useParams().roomId;
  useEffect(() => {
    setTimeout(() => {
      initializeSetting();
      // 서버가 보낸 다른사람의 그림 데이터
      App.mainSocket.on("myCanvas", (data) => {
        if (userInfo[data.senderId]) {
          userInfo[data.senderId].video.imgTag.src = data.imageData;
        }
        // 테스트용 코드
        // imgTag1 = document.getElementById("imgTag1");
        // imgTag1.src = data.imageData;
      });
      return startMedia();
    }, 2000);
    App.mainSocket.on("speakingState", (data) => {
      // 테스트용 코드 주석처리 필요
      // videoFrame1 = document.getElementById("videoFrame1");
      // videoFrame1.className = "videoTagSpeaking";
      // setTimeout(() => {
      //   videoFrame1.className = "videoTagNotSpeaking";
      // }, 1000);
      if (userInfo[data.speakerId]) {
        userInfo[data.speakerId].video.videoFrame.className =
          "videoTagSpeaking";
        setTimeout(() => {
          userInfo[data.speakerId].video.videoFrame.className =
            "videoTagNotSpeaking";
        }, 1000);
      }
    });
  }, []);
  const imgTagOnOff = (idx, isOn) => {
    if (videos) {
      if (isOn) {
        videos[idx].imgTag.className = "imgTagOn";
        if (videos[idx].videoTag.srcObject) {
          // videos[idx].videoTag.srcObject.getVideoTracks()[0].muted = true;
          // videos[idx].videoTag.visibility = "visible";
          videos[idx].videoTag.className = "videoTagOff";
        }
      } else {
        videos[idx].imgTag.className = "imgTagOff";
        if (videos[idx].videoTag.srcObject) {
          // videos[idx].videoTag.srcObject.getVideoTracks()[0].muted = false;
          // videos[idx].videoTag.visibility = "hidden";
          videos[idx].videoTag.className = "videoTag";
        }
      }
    }
    // 테스트용코드
    // imgTag1 = document.getElementById("imgTag1");
    // imgTag1.className = "imgTagOn";
  };
  return (
    <div className="ROOM-BODY-WebRTC">
      <div className="CAMs">
        {/* <div className="CamFrame"> */}
        <div id="videoFrame1" className="videoTagNotSpeaking">
          <video
            id="peersFace1"
            autoPlay
            className="videoTag"
            playsInline
            onClick={() => {
              imgTagOnOff(0, true);
            }}
          ></video>
          <img
            id="imgTag1"
            className="imgTagOff"
            onClick={() => {
              imgTagOnOff(0, false);
            }}
          ></img>
        </div>
        {/* <img src={cans} className="img.component-cans" alt="user cam"  /> */}
        {/* <div className="name_layout">
            <span className="name_span">Name</span>
          </div> */}
        {/* </div> */}
        {/* <div className="CamFrame"> */}
        {/* <img src={cans} className="img.component-cans" alt="a" /> */}
        <div id="videoFrame2" className="videoTagNotSpeaking">
          <video
            id="peersFace2"
            autoPlay
            playsInline
            className="videoTag"
            onClick={() => {
              imgTagOnOff(1, true);
            }}
          ></video>
          <img
            onClick={() => {
              imgTagOnOff(1, false);
            }}
            id="imgTag2"
            className="imgTagOff"
          ></img>
          {/* </div> */}
          {/* <div className="name_layout">
            <span className="name_span">Name</span>
          </div> */}
        </div>
        {/* <div className="CamFrame"> */}
        {/* <img src={cans} className="img.component-cans" alt="a" /> */}
        <div id="videoFrame3" className="videoTagNotSpeaking">
          <video
            id="peersFace3"
            autoPlay
            playsInline
            className="videoTag"
            onClick={() => {
              imgTagOnOff(2, true);
            }}
          ></video>
          <img
            onClick={() => {
              imgTagOnOff(2, false);
            }}
            id="imgTag3"
            className="imgTagOff"
          ></img>
          {/* </div> */}
          {/* <div className="name_layout">
            <span className="name_span">Name</span>
          </div> */}
        </div>
        {/* <div className="CamFrame"> */}
        {/* <img src={cans} className="img.component-cans" alt="a" /> */}
        <div id="videoFrame4" className="videoTagNotSpeaking">
          <video
            id="peersFace4"
            autoPlay
            playsInline
            className="videoTag"
            onClick={() => {
              imgTagOnOff(3, true);
            }}
          ></video>
          <img
            onClick={() => {
              imgTagOnOff(3, false);
            }}
            id="imgTag4"
            className="imgTagOff"
          ></img>
          {/* </div> */}
          {/* <div className="name_layout">
            <span className="name_span">Name</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

// 카메라 전환 버튼
// async function handleCameraChange() {
//   await getMedia(cameraSelect.value);
//   if (sendingConnection) {
//     const videoTrack = myStream.getVideoTracks()[0];
//     const videoSender = sendingConnection
//       .getSenders()
//       .find((sender) => sender.track.kind === "video");
//     videoSender.replaceTrack(videoTrack);
//   }
// }

WebRTC.handleMuteBtn = handleMuteBtn;
WebRTC.handleCameraBtn = handleCameraBtn;
export default WebRTC;
