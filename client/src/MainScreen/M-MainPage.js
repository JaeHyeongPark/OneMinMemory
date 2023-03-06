import React from "react";
import MainBody from "./M-Body";
import MainHeader from "./M-Header";

function MainPage() {
  return (
    <React.Fragment>
      {/* <MainHeader /> */}
      <div style={{ height: "100%" }}>
        <MainBody />
      </div>
    </React.Fragment>
  );
}
export default MainPage;
