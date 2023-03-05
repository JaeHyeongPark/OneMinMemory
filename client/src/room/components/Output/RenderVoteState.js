import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import App from "../../../App";
import voteSound from "../../assets/voteSound.mp3"

function RenderVoteState() {
  const [activeStep, setActiveStep] = useState(0);
  const [numPeople, setNumPeople] = useState([1]);
  const votesound = new Audio(voteSound)

  useEffect(() => {
    App.mainSocket.on("someoneCame", (data) => {
      changeNumPeople(Number(data.numUsers));
    });
    App.mainSocket.on("someoneVoted", (data) => {
      setActiveStep(data.renderVoteState);
      votesound.play()
    });
  }, []);
  
  const isTrue = (idx) => {
    return idx < activeStep;
  };
  const handleRenderOnButton = () => {
    setActiveStep(activeStep + 1);
    return activeStep + 1 === numPeople.length;
  };
  RenderVoteState.handleRenderOnButton = handleRenderOnButton;

  const setVoteState = (a) => {
    setActiveStep(a);
  };
  RenderVoteState.setVoteState = setVoteState;
  const changeNumPeople = (numUsers) => {
    let newList = [];
    for (let i = 0; i < numUsers; i++) {
      newList.push([1]);
    }
    setNumPeople(newList);
  };

  RenderVoteState.setNumPeople = changeNumPeople;
  return (
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
  );
}
export default RenderVoteState;
