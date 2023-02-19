import axios from "axios";
import { createContext, useEffect, useState } from "react";

const PlaylistContext = createContext({
  playlist: [],
  selecttime: '',
  selectDT : '',
  totaltime: 0,
  selectidx:'',
  changeidx: () => {},
  changeTT: () => {},
  changeDT : () => {},
  changetime: () => {},
  addToPlaylist: () => {},
});

export const PlaylistContextProvider = (props) => {
  //   const [isChanged, setIsChanged] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [time, settime] = useState('')
  const [DT, setDT] = useState('')
  const [TT, setTT] = useState(0)
  const [idx, setidx] = useState('')

  useEffect(() => {
    axios.get("http://localhost:5000/output/getplaylist").then((res) => {
      setPlaylist(res.data.results);
    });
  }, []);

  //   const setChangeHandler = () => {};

  const addToPlaylistHandler = (track) => {
    setPlaylist(track);
  };
  const changetime = (time) => {
    settime(time)
  }
  const changeDT = (DT) => {
    setDT(DT)
  }
  const changeTT = (TT) => {
    setTT(TT)
  }
  const changeidx = (idx) => {
    setidx(idx)
  }

  const context = {
    playlist: playlist,
    selecttime:time,
    selectDT:DT,
    totaltime:TT,
    selectidx:idx,
    changeidx:changeidx,
    changeTT:changeTT,
    changeDT:changeDT,
    changetime:changetime,
    addToPlaylist: addToPlaylistHandler,
  };

  return (
    <PlaylistContext.Provider value={context}>
      {props.children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;
