import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import img from '../../../../assets/flat2.jpg'
import DropzoneButton from '../../../../Reusable Components/Dropzone/DropzoneButton';
import { useState } from 'react';
import '../project.scss'
import { Chip } from '@mui/material';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Success } from '../../../SuccessPage/Success';
import { createProject, getDecodedToken, getToken } from '../../../../Utils/requests'
const steps = ['Create a project', 'Add info', 'Upload files'];

function MySteps(props) {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [stepperStatus, setStepperStatus] = useState(props.stepperStatus ? props.stepperStatus : { title: '', description: '' })

    // Function to handle new files being uploaded
    const handleFilesUploaded = (files) => {
        setUploadedFiles(files);
        props.onFilesUploaded(files);
    };

    function handleTitleChange(e,) {
        let status = stepperStatus;
        status.title = e.target.value;
        setStepperStatus(status);
        props.onStateChange(status);
    }

    function handleDescriptionChange(e) {
        let status = stepperStatus;
        status.description = e.target.value;
        setStepperStatus(status);
        props.onStateChange(status);
    }

    switch (props.number) {
        case 1:
            return (
                <div className="container col-xxl-8 px-4 py-5 my-modal">
                    <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <img src={img} className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" />
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold lh-1 mb-3">Create a project</h1>
                            <p className="lead">In this section we can quickly make a fresh project from scrap.</p>
                        </div>
                    </div>
                </div>
            )
        case 2:
            return (
                <div className="container col-xxl-8 px-4 py-5 my-modal">
                    <div className="row flex-lg-row-reverse flex-wrap-reverse align-items-center g-5 py-5">
                        <div className="col-12">
                            <div className='row'>
                                <div className='col-12'>
                                    <TextField sx={{ marginBottom: '25px', width: '100%' }} id="standard-basic" label="Title" variant="standard" onChange={handleTitleChange} defaultValue={stepperStatus.title} />
                                </div>
                                <div className='col-12'>
                                    <TextField sx={{ width: '100%' }} helperText="A quick description for now" id="standard-basic" label="Description" variant="filled" multiline rows={4} defaultValue={stepperStatus.description} onChange={handleDescriptionChange} />
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <h1 className="display-5 fw-bold lh-1 mb-3">Add some info</h1>
                            <p className="lead">What is your project about?</p>
                        </div>
                    </div>
                </div>
            )
        default:
            return (

                <div className="container overflow-auto col-xxl-8 px-4 py-5 my-modal">
                    <div className="row my-row flex-lg-row-reverse align-items-center g-5 py-5">
                        <div className="col-12">
                            <div className='row'>
                                <div className='col-12 my-dropzone'>
                                    <DropzoneButton uploadedFilesprops={uploadedFiles} onFilesUploaded={handleFilesUploaded} />
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <h1 className="display-5 fw-bold lh-1 mb-3">Upload your files</h1>
                            <p className="lead">Upload you documents, later on you will be able to edit other properties about this project.</p>
                        </div>

                    </div>
                </div>

            )
    }
}

export default function HorizontalLinearStepper({ closeEvent, updateProjects }) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [responseOk, setResponseOk] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stepperStatus, setStepperStatus] = useState({ title: '', description: '' })
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    const handleClose = () => {
        updateProjects()
        closeEvent();
    }

    const handleFilesUploaded = (files) => {
        setUploadedFiles(files);
    };

    const isStepOptional = (step) => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    function handleChildrenChange(status) {
        let newStatus = status;
        setButtonDisabled(isFormCompleted(activeStep));
        setStepperStatus(newStatus);
    }

    const handleSubmit = async () => {
        const projectData = new FormData();
        projectData.append('name', stepperStatus.title);
        projectData.append('description', stepperStatus.description);

        uploadedFiles.forEach((file) => {
            projectData.append('files', file);
        });

        const token = getToken();

        if (token) {
            const decodedToken = getDecodedToken();
            setLoading(true);
            await createProject(decodedToken.user_id, token, projectData).then((response) => {
                if (response.status === 200) {
                    setResponseOk(true);
                    updateProjects();
                }
            }).finally(() => {
                setLoading(false);
            })
                .catch((error) => {
                    console.error(error);
                });

        } else {
            console.error('Token not found in localStorage');
        }
    };

    const handleNext = (e) => {
        let newSkipped = skipped;

        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        if (e.target.innerText === 'FINISH') {
            handleSubmit();
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setButtonDisabled(isFormCompleted(activeStep + 1));
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    function isFormCompleted(step) {
        if (step === 0)
            return false;
        else {
            if (stepperStatus.title === '' || stepperStatus.description === '')
                return true;
            return false;
        }
    }

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
                    {loading ?
                        <div className="spinner-border text-dark my-spinner" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        :
                        null
                    }
                    {responseOk ?
                        <Success label='Project created successfully' helperText='We have accepted your request, Thank you. ' />
                        :
                        null
                    }
                    {!responseOk && !loading ?
                        <Success label='Project not created' helperText='Something went wrong... ' />
                        : null
                    }


                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleClose}>Close</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <MySteps state={stepperStatus} onStateChange={handleChildrenChange} number={activeStep + 1} onFilesUploaded={handleFilesUploaded} />
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

                        <Button onClick={handleNext} disabled={isButtonDisabled}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}