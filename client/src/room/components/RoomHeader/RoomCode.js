import React, { useContext } from "react";

import RoomCodeContext from "../../../shared/context/roomcode-context";
import "./RoomCode.css";

const RoomCode = () => {
  const roomcodeCtx = useContext(RoomCodeContext);

  return <span className="room_number">{roomcodeCtx}</span>;
};

export default RoomCode;
