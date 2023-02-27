import React from "react";
import { useParams } from "react-router";
import copylink from "../../assets/copyLink.png";
import "./RoomCode.css";
import SnackBar from "./SnackBar";
const RoomCode = () => {
  const roomid = useParams().roomId;

  const copyurl = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(
        `http://localhost:3000/room/${roomid}`
      );
      SnackBar.roomUrlSuccessOpen();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <span className="room_number">
        {roomid}
        <img
          src={copylink}
          onClick={copyurl}
          style={{ width: "20px", cursor: "pointer" }}
        />
      </span>
    </div>
  );
};

export default RoomCode;
