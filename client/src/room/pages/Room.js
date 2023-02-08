import React from "react";

import RoomHeader from "./RoomHeader";
import Contents from "./Contents";

const Room = () => {
  return (
    <React.Fragment>
      <RoomHeader />
      <main>
        <Contents />
      </main>
    </React.Fragment>
  );
};
export default Room;
