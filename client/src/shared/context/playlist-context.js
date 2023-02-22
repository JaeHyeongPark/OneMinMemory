// import axios from "axios";
import { createContext, useEffect, useState } from "react";

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
  // translist: [],
  addToPlaylist: () => {},
  musicidx: "",
  changemusicidx: () => {},
  musicsrc: "",
  selectmusicsrc: () => {},
});

export const PlaylistContextProvider = (props) => {
  //   const [isChanged, setIsChanged] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [time, settime] = useState("");
  const [DT, setDT] = useState("");
  const [TT, setTT] = useState(0);
  const [idx, setidx] = useState("");
  const [musicIdx, setMusicIdx] = useState("0");
  const [musicSrc, setMusicSrc] = useState("");
  // const [translist, setTranslist] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/output/getplaylist").then((res) => {
      setPlaylist(res.data);
    });
  }, []);

  // useEffect(() => {
  //   setTranslist([
  //     {
  //       transition: [
  //         "-filter_complex",
  //         "[0:v][1:v]xfade=transition=hrslice:duration=1:offset=3",
  //       ],
  //     },
  //     {
  //       transition: [
  //         "-filter_complex",
  //         "[0:v][1:v]xfade=transition=distance:duration=1:offset=3",
  //       ],
  //     },
  //     {
  //       transition: [
  //         "-filter_complex",
  //         "[0:v][1:v]xfade=transition=rectcrop:duration=1:offset=3",
  //       ],
  //     },
  //     {
  //       transition: [
  //         "-filter_complex",
  //         "[0:v][1:v]xfade=transition=radial:duration=1:offset=3",
  //       ],
  //     },
  //     {
  //       transition: [
  //         "-filter_complex",
  //         "[0:v][1:v]xfade=transition=pixelize:duration=1:offset=3",
  //       ],
  //     },
  //   ]);
  // }, []);

  //   const setChangeHandler = () => {};

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
    // translist: translist,
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
