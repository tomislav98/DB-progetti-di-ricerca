import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs, Link, Typography, Fab, styled, Modal, useMediaQuery } from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdjust, faAngleLeft, faCalendar, faFile, faLock, faNoteSticky, faGauge, faUpload, faSubscript, faChevronUp, faCheck, faClose, faDownload } from "@fortawesome/free-solid-svg-icons";
import feather from 'feather-icons';
import 'chartjs-adapter-date-fns';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { RingProgress, Center, Group, Code, ScrollArea, Divider, Paper, Text, CloseButton, Button } from "@mantine/core";
import { LinksGroup } from "./LinksGroup";
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock,
} from '@tabler/icons-react';
// import Logo from '../../../../assets/unilogo.svg'
import classes from './NavbarNested.module.scss';
import { StatusBadge } from "../Projects";
import { downloadDocumentsbyId, getToken } from "../../../../Utils/requests";
import { saveAs } from 'file-saver';

// Can be used to fake an input in the graph until the true data arrives  
const skeletonInput = [

];


const options = {
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'month',
                displayFormats: {
                    month: 'MMMM yyyy',
                },
            },
            title: {
                display: true,
                text: 'Date of Creation',
            },
        },
        y: {
            title: {
                display: true,
                text: 'Project Version',
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        },
    },
};

const data = {
    datasets: [
        {
            label: 'My Dataset',
            data: skeletonInput,
        },
    ],
}

const createData = (i) => {
    return {
        datasets: [
            {
                label: 'My Dataset',
                data: i,
            },
        ],
    }
};

function stringToNumber(versione) {
    // v0.0.0

    // Rimuovo il carattere 'v' se presente
    versione = versione.replace('v', '');

    // Sostituisco i punti con un punto decimale
    const integer = parseInt(versione.split('.')[0])

    // Converto la stringa in un numero in virgola mobile
    const decimal = parseFloat(versione.split('.')[1] + versione.split('.')[2]);

    return integer + decimal;
}


function MyChart({ projectVersions }) {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (projectVersions && projectVersions.all_versions) {
            const versionsData = projectVersions.all_versions.map((p) => {
                return { x: new Date(p.created), y: stringToNumber(p.version) }
            });

            setChartData(createData(versionsData))
        }


    }, [projectVersions])

    return (
        <Line
            data={chartData ? chartData : data}
            options={options}
            width={900}
            height={380}
        />
    );
}

function MyDashboard({ title = '', projectVersions }) {


    async function downloadDocument() {
        const token = getToken();


        // TODO: e veramente da scorrere per tutte le versioni? secondo me no solo per ogni documento di una versione specifica,
        // qua secondo me si scaricano tutti i documenti di tutte le versioni, in caso basta togliere il ciclo esterno suppongo e usare projectVersion
        for (const v of projectVersions.all_versions) {
            for (const doc of v.documents) {
                // console.log(projectVersions)
                // console.log(doc)
                // console.log(v)

                await downloadDocumentsbyId(doc.doc_id, token).then(async (response) => {
                    if (response) {
                        const blob = new Blob([response], { type: 'application/pdf' });
                        console.log(blob)
                        // attualmente settato il nome al titolo del progetto + la versione
                        const filename = title +' '+ v.version + '.pdf';
                        saveAs(blob, filename)
                    }
                    else {
                        console.error('Download failed: ', response.status, response.statusText)
                    }
                });
            }
        }
    }

    return (
        <main className="col-12 col-md-8 col-lg-9 col-xxl-10 px-md-5">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{title}</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                        <span data-feather="calendar" className="align-text-bottom"></span>
                        This week
                    </button>
                </div>
            </div>

            <MyChart projectVersions={projectVersions} />

            {projectVersions && projectVersions.all_versions ? (
                <h3>Project's versions</h3>
            ) : null}

            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Version</th>
                            <th scope="col">Created</th>
                            <th scope="col">Status</th>
                            <th scope="col">Documents</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectVersions && projectVersions.all_versions ? (
                            projectVersions.all_versions.map((version, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{version.version}</td>
                                    <td>{version.created}</td>
                                    <td ><StatusBadge status={version.status} /></td>
                                    <td >
                                        <button type="button" className="btn btn-sm btn-outline-secondary mx-4" onClick={async () => { await downloadDocument() }}>
                                            <FontAwesomeIcon icon={faDownload} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>1,001</td>
                                <td>random</td>
                                <td>data</td>
                                <td>placeholder</td>
                                <td>text</td>
                            </tr>
                            // Add more default rows as needed
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    )
}

function ProjectStatus({ version }) {
    const mockdata = [
        { label: 'Reports', icon: faGauge },
        {
            label: 'Update',
            icon: faNoteSticky,
            initiallyOpened: true,
            links: [
                { label: 'Project data', link: '/' },
                { label: 'Single document', link: '/' },
            ],
        },
        {
            label: 'Documents',
            icon: faCalendar,
            links: [
                { label: 'Upcoming releases', link: '/' },
                { label: 'Previous releases', link: '/' },
                { label: 'Releases schedule', link: '/' },
            ],
        },
        { label: 'Contracts', icon: faFile },
        { label: 'Settings', icon: faAdjust },
        {
            label: 'Security',
            icon: faLock,
            links: [
                { label: 'Enable 2FA', link: '/' },
                { label: 'Change password', link: '/' },
                { label: 'Recovery codes', link: '/' },
            ],
        },
    ];

    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);


    return (
        <div className="" >
            <div className='row half-page-container' style={{ marginBottom: '25px', justifyContent: 'left' }}>
                <div className='row total-title-row ' style={{ textAlign: "left" }}>
                    <h3>Project's info</h3>
                </div>
                <div className='row total-title-row align-items-center' style={{ marginLeft: '5px' }}>
                    <div className='total-title-row' style={{ textAlign: "left" }} >
                        <div className="row"  >
                            <div className="col-8">
                                <span className="text-muted small fw-bold">Title: </span>
                            </div>
                            <div className="col-12" style={{ marginBottom: '20px' }}>
                                <span> {version ? version.name : ''} </span>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col-8">
                                <span className="text-muted small fw-bold">Description: </span>
                            </div>
                            <div className="col-12" style={{ marginBottom: '20px' }}>
                                <span> {version ? version.description : ''} </span>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col-8">
                                <span className="text-muted small fw-bold">Latest version: </span>
                            </div>
                            <div className="col-4">
                                <span> {version ? version.version : 'v0.0.0'} </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-8">
                                <span className="text-muted small fw-bold">Latest status: </span>
                            </div>
                            <div className="col-4" >
                                <StatusBadge status={version ? version.status : null} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row half-page-container'>
                <div className={classes.mantineHeader}>
                    <Group justify="space-between">
                        <div className="d-flex">
                            <h3>Links</h3>
                        </div>
                    </Group>
                </div>

                <ScrollArea className={classes.mantineLinks}>
                    <div className={classes.mantineLinksInner}>{links}</div>
                </ScrollArea>
            </div>
        </div>
    )
}

export function SubmitBanner({ onSubmit, onCancel }) {
    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches ? '50vw' : '90vw',
        bgcolor: 'background.paper',
        borderRadius: '15px',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Paper withBorder p="lg" radius="md" shadow="md" style={style}>
            <Group justify="space-between" mb="xs">
                <Text fz="md" fw={500}>
                    Submit project
                </Text>
                <CloseButton mr={-9} mt={-9} />
            </Group>
            <Text c="dimmed" fz="s">
                So, here's the deal: we want to ensure that you're absolutely certain about submitting your project for evaluation.
                By doing so, your project will be reviewed by our assessors in the upcoming evaluation round.
                However, you can always cancel your submission until that time. <br />
                Are you sure you want to proceed?
            </Text>
            <Group justify="flex-end" mt="md">
                <Button variant="default" size="xs" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="outline" size="xs" onClick={onSubmit}>
                    Submit
                </Button>
            </Group>
        </Paper>
    );
}


function ModalSubmit({ isOpen = false, onCloseModal, handleResponse, version }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(isOpen);

    const handleClose = () => {
        onCloseModal();
        setOpen(false);
    }

    const handleOpen = () => {
        // onOpenModal();
        setOpen(true);
    }

    // TODO: handling della risposta, piu fare in modo che se un progetto e gia dia un errore visivo e mostrare il loading della risposta
    function handleSubmit() {
        let token;
        let user_id;
        try {
            token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token,);
            user_id = decodedToken.user_id;

        } catch (error) {
            navigate('/login')
        }

        if (!token) {
            console.error('Token non trovato.');
            return;
        }

        if (!version) {
            console.error('Versione non esistente.');
            return;
        }


        const url = `http://localhost:5000/researchers/${user_id}/projects/${version.id}/submit`;

        const headers = {
            Authorization: `Bearer ${token}`
        };

        axios
            .put(url, null, { headers })
            .then(response => {
                // handleResponse(response.data);
                handleClose();
            })
            .catch(error => {
                console.error('Errore nella richiesta HTTP:', error);
            });

    }

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen])

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            centered='true'
        >
            <SubmitBanner onSubmit={handleSubmit} onCancel={handleClose} />
        </Modal>
    )
}

function ProjectActions({ version }) {
    const [fabOffset, setFabOffset] = useState(0);
    const [fabActive, setFabActive] = useState(false);
    const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
    const [isSubmitted, setSubmitted] = useState(false);
    const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const fabRef = useRef(null);


    useEffect(() => {
        setSubmitted(version ? version.status === 'ProjectStatus.SUBMITTED' : false)
    }, [version])

    const BootstrapTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.common.black,
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.common.black,
        },
    }));

    const animateFabOffset = () => {
        let start = null;
        const endValue = fabOffset >= 100 ? 0 : 100;
        setFabActive(!fabActive);


        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / 300; // You can adjust the duration (300ms) as needed.
            if (progress < 1) {
                const newOffset = fabOffset + (endValue - fabOffset) * progress;
                setFabOffset(newOffset);
                requestAnimationFrame(step);
            } else {
                setFabOffset(endValue);
            }
        };

        requestAnimationFrame(step);
    };

    function openWithdrawModal() {
        setWithdrawModalOpen(true)
    }

    function openSubmitModal() {
        setSubmitModalOpen(true);
    }

    function closeSubmitModal() {
        console.log('first');
        setSubmitModalOpen(false);
    }

    return (
        <div>
            <BootstrapTooltip title="Actions">
                <Fab
                    color="primary"
                    aria-label="add"
                    style={{ position: 'fixed', right: '25px', bottom: '25px' }}
                    onClick={animateFabOffset}
                >
                    <FontAwesomeIcon icon={faChevronUp} className={fabActive ? "my-fab-animation" : ""} />
                </Fab>
            </BootstrapTooltip>
            <BootstrapTooltip title={!isSubmitted ? "Submit" : "Withdraw"}>
                <Fab
                    color={!isSubmitted ? "secondary" : "error"}
                    aria-label="add"
                    style={{
                        position: 'fixed',
                        right: `${30 + fabOffset}px`,
                        bottom: '30px',
                        zIndex: 1,
                        boxShadow: !fabActive ? '2px 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
                    }}
                    size="medium"
                    ref={fabRef}
                    onClick={!isSubmitted ? openSubmitModal : openWithdrawModal}
                >
                    <FontAwesomeIcon icon={!isSubmitted ? faCheck : faClose} />
                </Fab>
            </BootstrapTooltip>
            <BootstrapTooltip title="Update">
                <span>
                    <Fab
                        color="secondary"
                        aria-label="add"
                        style={{
                            position: 'fixed',
                            right: `${30 + fabOffset * 2}px`,
                            bottom: '30px',
                            zIndex: 1,
                            boxShadow: !fabActive ? '2px 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
                        }}
                        size="medium"
                        disabled={isSubmitted}
                    >
                        <FontAwesomeIcon icon={faUpload} />
                    </Fab>
                </span>
            </BootstrapTooltip>
            <ModalSubmit version={version} isOpen={isSubmitModalOpen} onCloseModal={closeSubmitModal} />
        </div>
    );
}

export default function SingleProject({ projects }) {
    const [projectVersions, setProjectVersions] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [rightValue, setRightValue] = useState(100);

    const navigate = useNavigate();

    const updateRightValue = () => {
        if (rightValue > 0) {
            if (rightValue > 0.1)
                setRightValue(rightValue * 0.90);
            else if (rightValue > 0.1)
                setRightValue(rightValue * 0.66); // Riduci gradualmente il valore di "right"
            else
                setRightValue(0);
        }
    };

    function findCurrentProject(projects) {
        const currentPath = window.location.pathname;
        const segments = currentPath.split('/');
        const projectId = parseInt(segments[segments.length - 1]);
        const current = projects.find((proj) => { return proj.id === projectId })
        setCurrentProject(current);
    }

    function fetchProjects() {
        let token = null;
        let user_id = null;

        try {
            token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            user_id = decodedToken.user_id;

        } catch (error) {
            navigate('/login')
        }

        axios.get('http://localhost:5000/researchers/' + user_id + '/projects', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
            .then((response) => {
                findCurrentProject(response.data);
                setProjectList(response.data.reverse());
            })
            .catch((error) => {
                console.error('Errore nella chiamata Axios:', error);
            });
    }

    function fetchVersions() {
        let token = null;

        try {
            token = localStorage.getItem('token');
        } catch (error) {
            navigate('/login');
        }

        if (projects.length === 0)
            fetchProjects();
        else {
            setProjectList(projects);
            findCurrentProject(projects);
        }

        const currentPath = window.location.pathname;
        const segments = currentPath.split('/');
        const projectId = segments[segments.length - 1];

        axios({
            method: 'GET',
            url: `http://localhost:5000/projects/${projectId}/versions`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                setProjectVersions(response.data);
            })
            .catch((error) => {
                console.error('Errore nella richiesta:', error);
            });
    }

    function handleGoBack() {
        navigate('/mainpage/projects')
    }

    useEffect(() => {
        fetchVersions();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(updateRightValue, 17);

        // Controlla se rightValue è diventato 0, e in tal caso, pulisci l'intervallo
        if (rightValue === 0) {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [rightValue]);

    return (
        <div className="project-slider" style={{ right: `${rightValue}vw` }}>
            <nav className="navbar navbar-light justify-content-start" style={{ height: '10%', paddingLeft: '25px', paddingRight: '25px' }}>
                <FontAwesomeIcon icon={faAngleLeft} style={{ cursor: "pointer" }} onClick={handleGoBack} />
                <Breadcrumbs aria-label="breadcrumb" style={{ marginLeft: '25px' }}>
                    <Link underline="hover" color="inherit" href="/">
                        Mainpage
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        href="/material-ui/getting-started/installation/"
                    >
                        Projects
                    </Link>
                    <Typography color="text.primary">Project {currentProject ? currentProject.id : null} </Typography>
                </Breadcrumbs>
            </nav>

            <div className="container-fluid single-project-content"  >
                <div className="row" style={{ height: '100%' }}>
                    {
                        currentProject ?
                            <MyDashboard title={currentProject.name ? currentProject.name : ''} projectVersions={projectVersions} />
                            :
                            <MyDashboard title={''} projectVersions={projectVersions} />
                    }
                    <div className="col-12 col-md-4 col-lg-3 col-xxl-2 p-md-4" style={{ height: '90vh' }}>

                        <ProjectActions version={currentProject} />
                        <ProjectStatus version={currentProject} />
                    </div>
                </div>
            </div>
        </div>
    )
}