import React from "react";
import { useParams } from "react-router";
import copylink from "../../assets/copyLink.png";
import "./RoomCode.css";
import SnackBar from "./SnackBar";

const RoomCode = () => {
  const roomid = useParams().roomId;

  // 메인화면 초대URL 클립보드 저장
  const copyurl = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(
        process.env.REACT_APP_myURL + `/room/${roomid}`
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
