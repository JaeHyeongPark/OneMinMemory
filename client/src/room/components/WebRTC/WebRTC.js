import React from "react";

// import cans from "../../assets/cans.svg";

import "./WebRTC.css";

import { io } from "socket.io-client"; // Client Socket

console.log(1);

// const socket = io("https://23f7-1-223-174-170.jp.ngrok.io", {
//   cors: {
//     origin: "*",
//     credentials: true,
//   },
// });

// const socket = io("https://23f7-1-223-174-170.jp.ngrok.io", {
//   withCredentials: true,
//   extraHeaders: {
//     "Content-Security-Policy":
//       "default-src 'self' https://cdn.ngrok.com 'unsafe-eval' 'unsafe-inline'",
//   },
// });

const socket = io("https://23f7-1-223-174-170.jp.ngrok.io", {
  transports: ["websocket"],
});
// socket.connect();
socket.emit("joinRoom", { roomId: 1 });

const WebRTC = () => {
  return (
    <div className="ROOM-BODY-WebRTC">
      <div className="CAMs">
        <div className="CamFrame">
<<<<<<< HEAD
          {/* <img src={cans} className="img.component-cans" alt="a" /> */}
          <video
            id="peersFace1"
            autoPlay
            playsInline
            height="180px"
            width="240px"
          ></video>
=======
          <img src={cans} className="img.component-cans" alt="user cam" />
>>>>>>> feature/roomdev
          <div className="name_layout">
            <span className="name_span">Name</span>
          </div>
        </div>
        <div className="CamFrame">
<<<<<<< HEAD
          {/* <img src={cans} className="img.component-cans" alt="a" /> */}
          <video
            id="peersFace2"
            autoPlay
            playsInline
            height="180px"
            width="240px"
          ></video>
=======
          <img src={cans} className="img.component-cans" alt="user cam" />
>>>>>>> feature/roomdev
          <div className="name_layout">
            <span className="name_span">Name</span>
          </div>
        </div>
        <div className="CamFrame">
<<<<<<< HEAD
          {/* <img src={cans} className="img.component-cans" alt="a" /> */}
          <video
            id="peersFace3"
            autoPlay
            playsInline
            height="180px"
            width="240px"
          ></video>
=======
          <img src={cans} className="img.component-cans" alt="user cam" />
>>>>>>> feature/roomdev
          <div className="name_layout">
            <span className="name_span">Name</span>
          </div>
        </div>
        <div className="CamFrame">
<<<<<<< HEAD
          {/* <img src={cans} className="img.component-cans" alt="a" /> */}
          <video
            id="peersFace4"
            autoPlay
            playsInline
            height="180px"
            width="240px"
          ></video>
=======
          <img src={cans} className="img.component-cans" alt="user cam" />
>>>>>>> feature/roomdev
          <div className="name_layout">
            <span className="name_span">Name</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebRTC;
