import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import WorkStation from "../components/WorkStation/WorkStation";
import WebRTC from "../components/WebRTC/WebRTC";
import Output from "../components/Output/Output";
import { PlaylistContextProvider } from "../../shared/context/playlist-context";

import "./Contents.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Contents = () => {
  return (
    <React.Fragment>
      <DndProvider backend={HTML5Backend}>
        <PlaylistContextProvider>
          <div className="ROOM-BODY">
            <WorkStation />
            <WebRTC />
          </div>
          <Output />
        </PlaylistContextProvider>
      </DndProvider>
    </React.Fragment>
  );
};

export default Contents;
