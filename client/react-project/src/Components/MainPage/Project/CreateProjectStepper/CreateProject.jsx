import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import img from '../../../../assets/flat2.jpg'
import DropzoneButton from'../../../Dropzone/DropzoneButton'
import '../project.scss'

const steps = ['Create a project', 'Add infos', 'Upload files'];
function MySteps(props) {
    console.log(props)
    switch (props.number) {
        case 1:
            console.log('first')
            return (
                <div class="container col-xxl-8 px-4 py-5 my-modal">
                    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
                        <div class="col-10 col-sm-8 col-lg-6">
                            <img src={img} class="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" />
                        </div>
                        <div class="col-lg-6">
                            <h1 class="display-5 fw-bold lh-1 mb-3">Create a project</h1>
                            <p class="lead">In this section we can quickly make a fresh project from scrap.</p>
                        </div>
                    </div>
                </div>
            )
        case 2:
            return (
                <div class="container col-xxl-8 px-4 py-5 my-modal">
                    <div class="row flex-lg-row-reverse flex-wrap-reverse align-items-center g-5 py-5">
                        <div class="col-12">
                            <div className='row'>
                                <div className='col-12'>
                                    <TextField sx={{marginBottom:'25px',width:'100%'}} id="standard-basic" label="Title" variant="standard" />
                                </div>
                                <div className='col-12'>
                                    <TextField sx={{width:'100%'}} helperText="A quick description for now" id="standard-basic" label="Description" variant="outlined" multiline rows={2}/>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <h1 class="display-5 fw-bold lh-1 mb-3">Add some infos</h1>
                            <p class="lead">What is your project about?</p>
                        </div>
                    </div>
                </div>
            )
        default:
            return (

                <div class="container col-xxl-8 px-4 py-5 my-modal">
                    <div class="row flex-lg-row-reverse flex-wrap-reverse align-items-center g-5 py-5">
                        <div class="col-12">
                            <div className='row'>
                                <div className='col-12 my-dropzone'>
                                    <DropzoneButton/>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <h1 class="display-5 fw-bold lh-1 mb-3">Upload your files</h1>
                            <p class="lead">Upload you documents, later on you will be able to edit other properties about this project.</p>
                        </div>
                    </div>
                </div>

            )
    }
}
export default function HorizontalLinearStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepOptional = (step) => {
        return false;
        // return step === 1;

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
                    <MySteps number={activeStep + 1} />
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

                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}