import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import { DateField } from '@mui/x-date-pickers';

const steps = ['Select start date', 'Select end date', 'Create evaluation window'];

function MySteps(props) {
    const [stepperStatus, setStepperStatus] = useState(props.stepperStatus ? props.stepperStatus : { title: '', description: '' })
    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);

    const handleEndDateChange = (value)=>{
        setEndValue(value);
        props.onFinish();
    }

    switch (props.number) {
        case 1:
            return (
                <div>
                    <StaticDatePicker defaultValue={dayjs(startValue)} onChange={setStartValue} />
                </div>
            )
        case 2:
            return (
                <StaticDatePicker defaultValue={dayjs(endValue)} minDate={dayjs(startValue)} onChange={handleEndDateChange} disabled={startValue ? false : true} />
            )
        default:
            return (
                <div>
                    <h3> Create a new evaluation window </h3>
                    <DateField defaultValue={dayjs(startValue)} readOnly />
                    <DateField defaultValue={dayjs(endValue)} readOnly/>
                </div>

            )
    }
}

export default function CreateWindowStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [stepperStatus, setStepperStatus] = useState({ title: '', description: '' }) // forse togliere ?
    const [canSubmit, setCanSubmit] = useState(false);

    const isStepOptional = (step) => {
        return false; // hard coded a false perche non ci sono steps opzionali
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <MySteps state={stepperStatus} number={activeStep + 1} onFinish={()=>{setCanSubmit(true)}}/>
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}

                        <Button onClick={handleNext} disabled={activeStep === steps.length - 1 && !canSubmit}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}
