import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import App from "../../../App";
import "./WebRTC.css";
import { Tooltip } from "@mui/material";
import { useEffect } from "react";
import { io } from "socket.io-client"; // Client Socket
import { useState } from "react";

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
    { urls: "stun:stun.l.google.com:19302" },
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
      maxBitrate: 300000,
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
  } catch (e) {
    console.log(e);
  }
}

// mute 버튼
function handleMuteBtn() {
  if (myStream.getAudioTracks().length === 0) {
    return false;
  }
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  return true;
}

// cameraOff 버튼
function handleCameraBtn() {
  if (myStream.getVideoTracks().length === 0) {
    return false;
  }
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  return true;
}

// 친구들 얼굴이 송출되는 태그
let peersFace1, peersFace2, peersFace3, peersFace4;

// 비디오에 해당하는 사람이 말할 때 반짝이는 태두리 태그
let videoFrame1, videoFrame2, videoFrame3, videoFrame4;

// 비디오에 해당하는 사람읜 캔버스에서 편집중인 사진 img 태그
let imgTag1, imgTag2, imgTag3, imgTag4;

// 수신되는 비디오를 틀어줄 태그들을 관리할 리스트
let videos;

// ---------------------RTC 코드------------------------

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
};
const WebRTC = () => {
  const [refresh, setRefresh] = useState({ id: 1 });
  roomId = useParams().roomId;
  let socket = io("https://onem1nutemem0ry.store", {
    path: "/sfusocket",
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd",
    },
  });
  // 서버에서 sendingConnection에 대한 answer을 주는 소켓
  socket.on("welcome", async (answer) => {
    try {
      await sendingConnection.setRemoteDescription(answer);
    } catch (e) {
      console.log(e);
    }
  });
  // server가 자신의 연결 후보 Ice Candidate를 받아 보내주는 socket
  socket.on("iceForSending", async (data) => {
    if (sendingConnection.remoteDescription != null) {
      await sendingConnection.addIceCandidate(data.ice);
    }
  });

  // 새로운 사용자 들어왔을 때 실행되는 소캣
  socket.on("makeNewPeer", (data) => {
    console.log(data.senderId + " 를 위한 비디오태그를 만들꼐요");
    streamIdToUser[data.streamId] = data.senderId;
    userInfo[data.senderId] = {};
    userInfo[data.senderId].streamId = data.streamId;
    let i = 0;
    while (i < 4) {
      if (videos[i].isConnected === false) {
        videos[i].isConnected = true;
        userInfo[data.senderId].video = videos[i];
        console.log("태그 잘 만들었어요!");
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

  // 서버가 보낸 협상 요청
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

  // 누군가 나갔음을 알리는 소캣
  socket.on("someoneLeft", (data) => {
    console.log(data.senderId + " 가 나갔습니다");
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

  useEffect(() => {}, [refresh]);

  // 방에 들어오면 실행되는 함수
  async function startMedia() {
    // 1. 자신의 스트림을 만든다
    await getMedia();
    // 2. 자신의 스트림을 서버로 보내줄 연결을 만든다.
    await makeSendingConection();
  }
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
          console.log("P2p 연결이 disconnected");
          streamIdToUser = {};
          sendingConnection.close();
          socket.disconnect();
          // initializeSetting();
          // sendingConnection = null;
          // startMedia();
          setRefresh({ ...refresh });
        } else if (sendingConnection.connectionState === "closed") {
          if (streamIdToUser !== {}) {
            console.log("P2p 연결이 disconnected");
            streamIdToUser = {};
            socket.disconnect();
            setRefresh({ ...refresh });
            // initializeSetting();
            // sendingConnection = null;
            // startMedia();
          }
        }
      });

      // 내가 받을 때만 의미가 있는 이벤트 리스너라 일단 비활성
      sendingConnection.addEventListener("track", (data) => {
        console.log("트랙이벤트 발생");
        let userId = streamIdToUser[data.streams[0].id];
        userInfo[userId].video.videoTag.srcObject = data.streams[0];
      });

      // 스트림 내에 모든 트랙들을 접근하는 함수를 이용하여 myPeercon
      await myStream.getTracks().forEach(async (track) => {
        await sendingConnection.addTrack(track, myStream);
      });

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
  useEffect(() => {
    setTimeout(() => {
      initializeSetting();
      // 서버가 보낸 다른사람의 그림 데이터를 받는 소캣이벤트
      App.mainSocket.on("myCanvas", (data) => {
        if (userInfo[data.senderId]) {
          userInfo[data.senderId].video.imgTag.src = data.imageData;
        }
      });
      return startMedia();
    }, 2000);
    // 누군가 말하고 있음을 알리는 소캣 이벤트
    App.mainSocket.on("speakingState", (data) => {
      if (userInfo[data.speakerId] && userInfo[data.speakerId].video) {
        userInfo[data.speakerId].video.videoFrame.className =
          "videoTagSpeaking";
        setTimeout(() => {
          userInfo[data.speakerId].video.videoFrame.className =
            "videoTagNotSpeaking";
        }, 1700);
      }
    });
  }, []);
  // 다른 사람의 비디오를 편집중인 사진으로 바꾸는 함수
  const imgTagOnOff = (idx, isOn) => {
    if (videos) {
      if (isOn) {
        videos[idx].imgTag.className = "imgTagOn";
        if (videos[idx].videoTag.srcObject) {
          videos[idx].videoTag.className = "videoTagOff";
        }
      } else {
        videos[idx].imgTag.className = "imgTagOff";
        if (videos[idx].videoTag.srcObject) {
          videos[idx].videoTag.className = "videoTag";
        }
      }
    }
  };
  return (
    <div className="ROOM-BODY-WebRTC">
      <Tooltip
        title={"Cam화면을 눌러서 친구의 Canvas를 볼수있습니다."}
        placement="bottom"
        arrow
      >
        <div className="CAMs">
          <div id="videoFrame1" className="videoTagNotSpeaking">
            <video
              id="peersFace1"
              autoPlay
              className="videoTag"
              playsInline
              onClick={() => {
                imgTagOnOff(0, true);
              }}
            />
            <img
              id="imgTag1"
              className="imgTagOff"
              onClick={() => {
                imgTagOnOff(0, false);
              }}
            ></img>
          </div>
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
          </div>
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
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

WebRTC.handleMuteBtn = handleMuteBtn;
WebRTC.handleCameraBtn = handleCameraBtn;
export default WebRTC;
