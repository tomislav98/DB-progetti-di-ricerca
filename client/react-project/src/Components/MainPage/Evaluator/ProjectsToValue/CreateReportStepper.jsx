import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Stepper, Step, StepLabel, Button, Typography, Stack, LinearProgress } from '@mui/material';
import { Rating } from '@mantine/core';
// import {SentimentVeryDissatisfiedIcon,SentimentDissatisfiedIcon, SentimentSatisfiedIcon, SentimentSatisfiedAltIcon, SentimentVerySatisfiedIcon } from '@mui/icons-material/'
import { IconCloudUpload, IconX, IconDownload, IconSatellite, Icon12Hours, IconClover } from '@tabler/icons-react';
import DropzoneButton from '../../../../Reusable Components/Dropzone/DropzoneButton';
import './ProjectsToValue.scss'
import { createReport, getToken } from '../../../../Utils/requests';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
        fontSize: "1.5em"
    },
    '& .MuiRating-iconFilled .MuiSvgIcon-root': {
        fontSize: "2em"
    }
}));

const customIcons = {
    1: {
        // icon: <SentimentVeryDissatisfiedIcon color="error" />,
        icon: <IconCloudUpload color="error" />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <IconDownload color="error" />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <IconSatellite color="warning" />,
        label: 'Neutral',
    },
    4: {
        icon: <Icon12Hours color="success" />,
        label: 'Satisfied',
    },
    5: {
        icon: <IconClover color="success" />,
        label: 'Very Satisfied',
    },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};


const steps = ['Upload Report', 'Vote', 'Create Report'];

const voteLabels = [
    {
        "title": "Rilevanza del Problema di Ricerca",
        "negative": "1: Il problema non è chiaro o non è rilevante",
        "positive": "10: Il problema è chiaramente definito e altamente rilevante"
    },
    {
        "title": "Obiettivi del Progetto",
        "negative": "1: Gli obiettivi non sono chiari o non sono pertinenti",
        "positive": "10: Gli obiettivi sono chiaramente definiti e pertinenti"
    },
    {
        "title": "Metodologia di Ricerca",
        "negative": "1: La metodologia è inadeguata o non è chiara",
        "positive": "10: La metodologia è chiara, solida e ben strutturata"
    },
    {
        "title": "Originalità e Innovazione",
        "negative": "1: Il progetto manca di originalità e innovazione",
        "positive": "10: Il progetto è altamente innovativo e contribuisce in modo significativo al campo"
    },
    {
        "title": "Fattibilità",
        "negative": "1: Il progetto è impraticabile o non realistico",
        "positive": "10: Il progetto è fattibile, con risorse adeguate e pianificazione realistica"
    },
    {
        "title": "Risultati Attesi",
        "negative": "1: I risultati attesi non sono chiari o non sono significativi",
        "positive": "10: I risultati attesi sono chiari, significativi e in linea con gli obiettivi del progetto"
    },
    {
        "title": "Reputazione del Ricercatore",
        "negative": "1: Il ricercatore non ha una buona reputazione o esperienza nel campo",
        "positive": "10: Il ricercatore ha una solida reputazione e competenza nel campo di studio"
    },
    {
        "title": "Risorse Disponibili",
        "negative": "1: Risorse insufficienti o non adatte per il progetto",
        "positive": "10: Risorse adeguate e ben pianificate sono disponibili per il progetto"
    },
    {
        "title": "Implicazioni Pratiche o Applicative",
        "negative": "1: Il progetto manca di applicazioni pratiche o impatti",
        "positive": "10: Il progetto ha forti implicazioni pratiche o applicative"
    },
    {
        "title": "Etica e Trasparenza",
        "negative": "1: Il progetto presenta preoccupazioni etiche significative o manca di trasparenza",
        "positive": "10: Il progetto è eticamente robusto e trasparente"
    }
]

function MySteps(props) {
    const [stepperStatus, setStepperStatus] = useState(props.stepperStatus ? props.stepperStatus : { title: '', description: '' })
    const [uploadedFiles, setUploadedFiles] = useState(props.uploadedFiles? props.uploadedFiles : []);
    const [votes, setVotes] = useState([null, null, null, null, null, null, null, null, null, null]);
    const [endValue, setEndValue] = useState(null);

    const handleFilesUploaded = (files) => {
        setUploadedFiles(files)
        props.onFilesUploaded(files)
    }

    const handleFileDelete = (index) => {
        const newUploadedFiles = [...uploadedFiles];
        newUploadedFiles.splice(index, 1);
        setUploadedFiles(newUploadedFiles);
        props.onFilesDeleted(newUploadedFiles)
    };

    const handleVoteChange = (val, i) => {
        votes[i] = val;
        setVotes([...votes]);
    
        const nonNullVotes = votes.filter(x => x !== null);
        const sum = nonNullVotes.reduce((acc, curr) => acc + curr, 0);
        const avg = nonNullVotes.length > 0 ? sum / nonNullVotes.length : 0;
    
        const percentage = nonNullVotes.length / votes.length;
        
        props.onVotesChanged(percentage, avg);
    }
    
    switch (props.number) {
        case 1:
            return (
                <div className='add-report-section'>
                    <h3 className='titles'>Aggiungi il report</h3>
                    <DropzoneButton onFilesUploaded={handleFilesUploaded} onFilesDeleted={handleFileDelete} maxFiles={1} uploadedFilesprops={uploadedFiles}/>
                </div>
            )
        case 2:
            return (
                <div className='vote-section'>
                    <h3 className='titles'> Votazione </h3>
                    <div className='row' style={{ overflowY: 'scroll', maxHeight: 400 }}>
                        {voteLabels.map((elem, index) => {
                            return (
                                <div className='row'>
                                    <div className='col-12' style={{ height: '40px' }}>
                                        <b>
                                            {elem.title}
                                        </b>
                                    </div>
                                    <div className='col-4 d-flex justify-center align-center' style={{ height: '60px' }}>
                                        {elem.negative}
                                    </div>
                                    <div className='col-4 d-flex justify-content-center'>
                                        <Stack spacing={1} >
                                            {/* <Rating className='justify-content-center' name="half-rating" defaultValue={votes[index]} precision={0.5} /> */}
                                            <Rating fractions={2} defaultValue={votes[index]} onChange={(val) => { handleVoteChange(val, index) }} />
                                        </Stack>
                                    </div>
                                    <div className='col-4 d-flex justify-center align-center'>
                                        {elem.positive}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )
        default:
            return (
                <div className="container py-5">
                    <div className="p-5 text-center bg-body-tertiary">
                        <svg className="bi mt-5 mb-3" width="48" height="48">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-exclamation-diamond" viewBox="0 0 16 16">
                                <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z" />
                                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                            </svg>
                        </svg>
                        <h1 className="text-body-emphasis">Attenzione</h1>
                        <p className="col-lg-6 mx-auto mb-4 text-muted">
                            Attenzione, stai per creare un report di valutazione. Tale report non potrà più essere modificato, continua solo se sei sicuro delle informazioni sottoposte.
                        </p>
                    </div>
                </div>
            )
    }
}

function VoteVerdict({value}){
    switch (true) {
        case (value <= 3):
            return 'NOT_APPROVED';
        case (value <= 7):
            return 'REQUIRES_CHANGES';
        case (value <= 10):
            return 'APPROVED';
        default:
            return 'DEFAULT';
    }
}

export default function CreateReportStepper(id) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [stepperStatus, setStepperStatus] = useState({ title: '', description: '' }) // forse togliere ?
    const [canSubmit, setCanSubmit] = useState(false);
    const [votesCompletion, setVotesCompletion] = useState(0);
    const [votesAvg, setVotesAvg] = useState(0);
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    React.useEffect(()=>{
        console.log(uploadedFiles)
    }, [uploadedFiles])

    const isStepOptional = (step) => {
        return false; // hard coded a false perche non ci sono steps opzionali
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const sendReport = async () => {
        const token = getToken();
        setLoading(true);
        const res = await createReport(token,id.id,votesAvg,uploadedFiles[0]);
        setLoading(false)
        
        if(res.status === 200){
            alert('fatto')
        }
        alert(res.status)

    }

    const handleNext = (event) => {
        if(event.target.innerText === 'FINISH'){
            sendReport();
            console.log('first')
        }

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

    const onVotesChanged = (progress, avg) => {
        setVotesAvg(avg)
        setVotesCompletion(progress * 100)
    }

    const deleteFiles = (newfiles) =>{
        setUploadedFiles([...newfiles])
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
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <MySteps state={stepperStatus} number={activeStep + 1} onFinish={() => { setCanSubmit(true) }} onVotesChanged={onVotesChanged} onFilesUploaded={setUploadedFiles} onFilesDeleted={deleteFiles} uploadedFiles={uploadedFiles}/>
                    <Typography sx={{ mt: 2, mb: 1 }}> {
                        activeStep === 1 ?
                            <LinearProgress variant="determinate" value={votesCompletion} />
                            :
                        activeStep === 2 ?
                            <p>Average vote: {votesAvg*2}/10 <VoteVerdict value={votesAvg*2}/></p>
                            :
                            null

                    }
                    </Typography>
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

                        <Button onClick={handleNext} disabled={activeStep === steps.length - 2 && votesCompletion !== 100}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}