import React from "react";
import { useParams } from "react-router";

import "./RoomCode.css";

const RoomCode = () => {
const roomid = useParams().roomId

  return <span className="room_number">{roomid}</span>;
};

export default RoomCode;
