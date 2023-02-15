import React from "react";

import WorkStation from "../components/WorkStation/WorkStation";
import WebRTC from "../components/WebRTC/WebRTC";
import Output from "../components/Output/Output";
import { PlaylistContextProvider } from "../../shared/context/playlist-context";

import "./Contents.css";

const Contents = () => {
  return (
    <React.Fragment>
      <PlaylistContextProvider>
        <div className="ROOM-BODY">
          <WorkStation />
          <WebRTC />
        </div>
        <Output />
      </PlaylistContextProvider>
    </React.Fragment>
  );
};

export default Contents;
