import React from "react";

import RoomHeader from "./RoomHeader";
import RoomBody from "./RoomBody";
import RoomFooter from "./RoomFooter";

const Room = () => {
  return (
    <React.Fragment>
      <RoomHeader />
      <main>
        <RoomBody />
      </main>
      <RoomFooter />
    </React.Fragment>
  );
};
export default Room;
