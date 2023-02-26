import Button from "@mui/material/Button";
import AutoFixNormalOutlinedIcon from "@mui/icons-material/AutoFixNormalOutlined";

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
      <Button
        className="sidebar-item"
        name="Canvas Effect"
        onClick={check}
        startIcon={<AutoFixNormalOutlinedIcon style={{ fontSize: 35 }} />}
      ></Button>
      {props.itemsmode && (
        <ul className="canvaseffect__items">
          <li>
            <Button
              className="sidebar-item"
              name="Brighten"
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
            >
              Sharpen
            </Button>
          </li>
          <li>
            <Button
              className="sidebar-item"
              name="Saturate"
              onClick={() => props.apply("Saturate")}
            >
              Saturate
            </Button>
          </li>
          <li>
            <Button
              className="sidebar-item"
              name="Grayscale"
              onClick={() => props.apply("Grayscale")}
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
