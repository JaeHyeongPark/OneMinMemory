import axios from "axios";
import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RoomCodeContext from "../../shared/context/roomcode-context";
import { AuthContext } from "../../shared/context/auth-context";
import RoomHeader from "../components/RoomHeader/RoomHeader";
import Contents from "./Contents";
import "./Room.css";

const Room = () => {
  const navigate = useNavigate();
  const AuthCtx = useContext(AuthContext);
  const roomId = useParams().roomId;

  useEffect(() => {
    axios
      .post("http://localhost:5000/home/check", { id: roomId })
      .then((res) => {
        if (res.data === "No") {
          navigate("/");
        }
      });
  }, []);

  return (
    <RoomCodeContext.Provider value={Math.floor(Math.random() * 1000)}>
      <React.Fragment>
        <RoomHeader />
        <main className="main-box">
          <Contents />
        </main>
      </React.Fragment>
    </RoomCodeContext.Provider>
  );
};
export default Room;
