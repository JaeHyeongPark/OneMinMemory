import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// require("dotenv").config();

const PlaylistContext = createContext({
  playlist: [],
  selecttime: "",
  selectDT: "",
  totaltime: 0,
  selectidx: "",
  changeidx: () => {},
  changeTT: () => {},
  changeDT: () => {},
  changetime: () => {},
  addToPlaylist: () => {},
  musicidx: "",
  changemusicidx: () => {},
  musicsrc: "",
  selectmusicsrc: () => {},
});

export const PlaylistContextProvider = (props) => {
  const roomId = useParams().roomId;
  const [playlist, setPlaylist] = useState([]);
  const [time, settime] = useState("");
  const [DT, setDT] = useState("");
  const [TT, setTT] = useState(0);
  const [idx, setidx] = useState("");
  const [musicIdx, setMusicIdx] = useState("0");
  const [musicSrc, setMusicSrc] = useState("");

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_expressURL + "/output/getplaylist", {
        roomid: roomId,
      })
      .then((res) => {
        setPlaylist(res.data);
      });
  }, [roomId]);

  const addToPlaylistHandler = (track) => {
    setPlaylist(track);
    let t = 0
    track.forEach((data) => t += data.duration)
    setTT(t)
  };
  const changetime = (time) => {
    settime(time);
  };
  const changeDT = (DT) => {
    setDT(DT);
  };
  const changeTT = (TT) => {
    setTT(TT);
  };
  const changeidx = (idx) => {
    setidx(idx);
  };
  const changemusicidx = (idx) => {
    setMusicIdx(idx);
  };

  const selectmusicsrc = (src) => {
    setMusicSrc(src);
  };

  const context = {
    playlist: playlist,
    selecttime: time,
    selectDT: DT,
    totaltime: TT,
    selectidx: idx,
    changeidx: changeidx,
    changeTT: changeTT,
    changeDT: changeDT,
    changetime: changetime,
    addToPlaylist: addToPlaylistHandler,
    musicidx: musicIdx,
    changemusicidx: changemusicidx,
    musicsrc: musicSrc,
    selectmusicsrc: selectmusicsrc,
  };

  return (
    <PlaylistContext.Provider value={context}>
      {props.children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;
