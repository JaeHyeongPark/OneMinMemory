import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import RoomHeader from "../components/RoomHeader/RoomHeader";
import Contents from "./Contents";
import "./Room.css";

import App from "../../App";

const Room = () => {
  const navigate = useNavigate();
  const roomId = useParams().roomId;

  // 생성된 방에만 들어가게 하기 위한 조건(처음 랜더링될때 실행)
  useEffect(() => {
    App.roomId = roomId;
    setTimeout(() => {
      App.mainSocket.emit("joinRoom", {
        Id: App.mainSocket.id,
        roomId: roomId,
      });
    }, 1000);
  }, []);
  App.mainSocket.on("welcome", (data) => {
    if (data.ans === "NO") {
      navigate("/");
    }
  });

  return (
      <React.Fragment>
        <RoomHeader />
        <main className="main-box">
          <Contents />
        </main>
      </React.Fragment>
  );
};
export default Room;
