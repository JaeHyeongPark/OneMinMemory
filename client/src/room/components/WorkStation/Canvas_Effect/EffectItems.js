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
          className="sidebar-item"
          name="Canvas Effect"
          onClick={check}
          startIcon={<AutoFixNormalOutlinedIcon style={{ fontSize: 35 }} />}
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
              Brighten
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
              Sharpen
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
              Saturate
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
              Grayscale
            </Button>
          </li>
        </ul>
      )}
    </>
  );
};
export default EffectItems;
