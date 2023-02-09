import React, { useContext } from "react";

import { RoomCodeContext } from "../../../shared/context/RoomCodeContext";
import "./RoomCode.css";

const RoomCode = () => {
  const roomcode = useContext(RoomCodeContext);

  return <span className="room_number">{roomcode}</span>;
};

export default RoomCode;
