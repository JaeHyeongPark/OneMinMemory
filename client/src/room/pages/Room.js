import React from "react";
import RoomCodeContext from "../../shared/context/roomcode-context";

import RoomHeader from "../components/RoomHeader/RoomHeader";
import Contents from "./Contents";
import App from "../../App.js";
import { useState, useEffect, useContext } from "react";

const Room = () => {
  useEffect(() => {
    // roomid여기
    const roomId = 1;
    App.mainSocket.emit("joinRoom", { id: App.mainSocket.id, roomId: roomId });
    App.roomId = roomId;
  }, []);
  return (
    <RoomCodeContext.Provider value={Math.floor(Math.random() * 1000)}>
      <React.Fragment>
        <RoomHeader />
        <main>
          <Contents />
        </main>
      </React.Fragment>
    </RoomCodeContext.Provider>
  );
};
export default Room;
