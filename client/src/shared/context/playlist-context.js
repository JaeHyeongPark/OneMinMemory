import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./auth-context";
import axios from "axios";

const PlaylistContext = createContext({
  playlist: [],
  selecttime: "",
  selectDT: "",
  selecttime: "",
  selectDT: "",
  totaltime: 0,
  selectidx: "",
  selectidx: "",
  changeidx: () => {},
  changeTT: () => {},
  changeDT: () => {},
  changeDT: () => {},
  changetime: () => {},
  addToPlaylist: () => {},
  musicidx: "",
  changemusicidx: () => {},
  musicsrc: "",
  selectmusicsrc: () => {},
});

export const PlaylistContextProvider = (props) => {
  const AuthCtx = useContext(AuthContext);
  const [playlist, setPlaylist] = useState([]);
  const [time, settime] = useState("");
  const [DT, setDT] = useState("");
  const [TT, setTT] = useState(0);
  const [idx, setidx] = useState("");
  const [musicIdx, setMusicIdx] = useState("0");
  const [musicSrc, setMusicSrc] = useState("");

  useEffect(() => {
    axios
      .post("https://chjungle.shop/output/getplaylist", {
        roomid: AuthCtx.rooomId,
      })
      .then((res) => {
        setPlaylist(res.data);
      });
  }, []);

  const addToPlaylistHandler = (track) => {
    setPlaylist(track);
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
