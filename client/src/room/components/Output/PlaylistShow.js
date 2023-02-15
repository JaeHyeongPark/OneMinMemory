// import axios from "axios";

const PlaylistShow = (props) => {
  const view = props.playView;

  //   const selectimage = async (url) => {
  //     axios
  //       .post("http://localhost:5000/photoBox/clickimage", { url: url })
  //       .then((res) => {})
  //       .then((res) => {
  //         props.change();
  //       });
  //   };

  const context = Object.keys(view).map((url) => {
    if (view[url] === 0) {
      return (
        <img
          className="toplay_img"
          key={url}
          src={url}
          alt="a"
          //   onClick={() => selectimage(url)}
        />
      );
    } else {
      return (
        <img
          className="toplay_select_img"
          key={url}
          src={url}
          alt="a"
          //   onClick={() => {
          //     selectimage(url);
          //   }}
        />
      );
    }
  });

  return <div className="playlist_layout">{context}</div>;
};
export default PlaylistShow;
