import voteO from "../../assets/voteO.svg";
import voteX from "../../assets/voteX.svg";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";

const btn_hover = {
  '&:hover':{
    backgroundColor: '#17171e'
  }
}

function RenderVoteState(props) {
  const activeStep = props.activeStep;
  const numPeople = props.numPeople;
  const isTrue = (idx) => {
    return idx < activeStep;
  };

  return (
    <div className="vote-container">
      <Box sx={{ alignContent: "center" }}>
        <Stepper>
          <Box sx={{ width: "100%" }}>
            <Stepper>
              {numPeople.map((a, index) => {
                const stepProps = {};
                const labelProps = {};
                stepProps.active = false;
                if (isTrue(index)) {
                  stepProps.completed = true;
                }
                return (
                  <Step
                    sx={{
                      paddingRight: "0px",
                    }}
                    key={index}
                    {...stepProps}
                  >
                    <StepLabel {...labelProps}></StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>
        </Stepper>
      </Box>
      {props.myVoteState ? (
        <Button sx={btn_hover} className="Rendervote" onClick={props.handleRenderOffButton}>
          <div className="Render_img_layout">
            <img src={voteX} alt="Rendering" className="Render_img" />
          </div>
          <span className="render_span">CANCEL</span>
        </Button>
      ) : (
        <Button sx={btn_hover} className="Rendervote" onClick={props.handleRenderOnButton}>
          <div className="Render_img_layout">
            <img src={voteO} alt="Rendering" className="Render_img" />
          </div>
          <span className="render_span">READY</span>
        </Button>
      )}
    </div>
  );
}
export default RenderVoteState;
