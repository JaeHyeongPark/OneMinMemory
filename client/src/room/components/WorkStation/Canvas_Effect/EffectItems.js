import Button from "@mui/material/Button";
import AutoFixNormalOutlinedIcon from "@mui/icons-material/AutoFixNormalOutlined";
import { Tooltip } from "@mui/material";

const EffectItems = (props) => {
  const check = (e) => {
    e.preventDefault();
    if (props.itemsmode === false) {
      props.check("showEffectItems");
      props.mode(true);
    } else {
      props.mode(false);
    }
  };
  return (
    <>
      <Tooltip title="사진 효과" placement="top" arrow>
        <Button
          sx={
            props.itemsmode && {
              bgcolor: "#ffd166",
              borderRadius: "15px",
              "&:hover": {
                backgroundColor: "#ffd166",
              },
            }
          }
          className="sidebar-item"
          name="Canvas Effect"
          onClick={check}
          startIcon={
            <AutoFixNormalOutlinedIcon
              style={{
                fontSize: 35,
                color: props.itemsmode ? "#17171e" : "#ffd166",
              }}
            />
          }
        ></Button>
      </Tooltip>
      {props.itemsmode && (
        <ul className="canvaseffect__items">
          <li>
            <Button
              className="sidebar-item"
              name="Brighten"
              sx={{
                bgcolor: "#272731",
                ":hover": {
                  bgcolor: "#30303d",
                  color: "white",
                },
                ":active": {
                  bgcolor: "darkgray",
                },
              }}
              onClick={() => props.apply("Brighten")}
            >
              <span style={{ color: "#ffd166" }}>Brighten</span>
            </Button>
          </li>
          <li>
            <Button
              className="sidebar-item"
              name="Sharpen"
              onClick={() => props.apply("Sharpen")}
              sx={{
                bgcolor: "#272731",
                ":hover": {
                  bgcolor: "#30303d",
                  color: "white",
                },
                ":active": {
                  bgcolor: "darkgray",
                },
              }}
            >
              <span style={{ color: "#ffd166" }}>Sharpen</span>
            </Button>
          </li>
          <li>
            <Button
              className="sidebar-item"
              name="Saturate"
              onClick={() => props.apply("Saturate")}
              sx={{
                bgcolor: "#272731",
                ":hover": {
                  bgcolor: "#30303d",
                  color: "white",
                },
                ":active": {
                  bgcolor: "darkgray",
                },
              }}
            >
              <span style={{ color: "#ffd166" }}>Saturate</span>
            </Button>
          </li>
          <li>
            <Button
              className="sidebar-item"
              name="Grayscale"
              onClick={() => props.apply("Grayscale")}
              sx={{
                bgcolor: "#272731",
                ":hover": {
                  bgcolor: "#30303d",
                  color: "white",
                },
                ":active": {
                  bgcolor: "darkgray",
                },
              }}
            >
              <span style={{ color: "#ffd166" }}>Grayscale</span>
            </Button>
          </li>
        </ul>
      )}
    </>
  );
};
export default EffectItems;
