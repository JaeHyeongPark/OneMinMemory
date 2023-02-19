import { useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import axios from "axios";
import PlaylistContext from "../../../shared/context/playlist-context";

import lineA from "../../assets/LineA.svg";
import lineB from "../../assets/LineB.svg";
import lineC from "../../assets/LineC.svg";

const Tik = (props) => {
  const playlistCtx = useContext(PlaylistContext);
  // 선택사진의 우측끝 지점을 드래그존으로 설정
  const [{ isDragging }, nowtime] = useDrag(
    () => ({
      type: "time",
      item: {
        time: props.time,
        idx: playlistCtx.selectidx,
        DT: playlistCtx.selectDT,
        TT: playlistCtx.totaltime,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [
      props.time,
      playlistCtx.selectidx,
      playlistCtx.selectDT,
      playlistCtx.totaltime,
    ]
  );

  // 나머지 시간들은 다 드랍존으로 설정
  const [{ isover }, choicetime] = useDrop(() => ({
    accept: ["time"],
    drop: (item) => changemovie(item.time, item.idx, item.DT, item.TT),
    collect: (monitor) => ({
      isover: monitor.isOver(),
    }),
  }));

  const changemovie = (time, idx, DT, TT) => {
    if (props.time < time - DT + 1 || TT + (props.time - time) > 60) {
      return;
    }

    axios
      .post("http://localhost:5000/output/changetime", {
        time: props.time - time,
        idx: idx,
      })
      .then((res) => {
        playlistCtx.addToPlaylist(res.data.playlist);
        playlistCtx.changetime("");
        playlistCtx.changeDT(res.data.DT);
      });
  };

  let content = "";

  if (props.time === playlistCtx.selecttime && playlistCtx.selecttime !== 0) {
    content = (
      <div ref={nowtime} style={{ height: "40px", backgroundColor:"red", cursor:"col-resize"}}>
        |
      </div>
    );
  } else {
    if (props.src === "A") {
      content = (
        <div className="timediv" ref={choicetime}>
          <img src={lineA} alt="A" />
        </div>
      );
    } else if (props.src === "B") {
      content = (
        <div className="timediv" ref={choicetime}>
          <img src={lineB} alt="B" />
        </div>
      );
    } else {
      content = (
        <div className="timediv" ref={choicetime}>
          <img src={lineC} alt="C" />
        </div>
      );
    }
  }
  return content;
};
export default Tik;
