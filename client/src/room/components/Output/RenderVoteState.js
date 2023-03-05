import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

function RenderVoteState(props) {
  const activeStep = props.activeStep;
  const numPeople = props.numPeople;
  console.log(numPeople);
  const isTrue = (idx) => {
    return idx < activeStep;
  };

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
