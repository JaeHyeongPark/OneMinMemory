import React from "react";
import { RoomCodeContext } from "../../shared/context/RoomCodeContext";

import RoomHeader from "../components/RoomHeader/RoomHeader";
import Contents from "./Contents";

const Room = () => {
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
