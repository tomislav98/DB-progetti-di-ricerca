import { useEffect, useState, useRef } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdjust, faAngleLeft, faCalendar, faFile, faLock, faNoteSticky, faStarHalfStroke, faGauge, faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import feather from 'feather-icons';
import 'chartjs-adapter-date-fns';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { RingProgress, Center, Group, Code, ScrollArea, Divider } from "@mantine/core";
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
        console.log(projectVersions.other_versions)

        if (projectVersions && projectVersions.other_versions) {
            const versionsData = projectVersions.other_versions.map((p) => {
                return { x: new Date(p.created), y: stringToNumber(p.version) }
            });


            console.log(createData(versionsData))
            console.log(data)
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
    return (
        <main className="col-md-9 col-lg-10 px-md-5">
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

            {projectVersions && projectVersions.other_versions ? (
                <h3>Project's versions</h3>
            ) : null}

            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Version</th>
                            <th scope="col">Created</th>
                            <th scope="col">Header</th>
                            <th scope="col">Header</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projectVersions && projectVersions.other_versions ? (
                            projectVersions.other_versions.map((version, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{version.version}</td>
                                    <td>{version.created}</td>
                                    {/* Include other relevant fields here */}
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
        { label: 'Submit', icon: faGauge },
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

    useEffect(()=>{
        console.log(version)
    },[])

    return (
        <div className="container-fluid ">
            <div className='row half-page-container' style={{marginBottom:'25px', paddingRight:'30px', justifyContent: 'left'}}>
                <div className='row total-title-row ' style={{ textAlign: "left" }}>
                    <h2>Project's info</h2>
                </div>
                <div className='row total-title-row align-items-center' style={{marginLeft:'5px'}}>
                    <div className='total-title-row' style={{ textAlign: "left" }} >
                        <div className="row"  >
                            <div className="col-8">
                                <span className="text-muted small fw-bold">Title: </span>
                            </div>
                            <div className="col-12" style={{ marginBottom:'20px'}}>
                                <span> {version ? version.name : ''} </span>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col-8">
                                <span className="text-muted small fw-bold">Description: </span>
                            </div>
                            <div className="col-12" style={{ marginBottom:'20px'}}>
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
                            <h3>Actions</h3>
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
        console.log(currentProject)
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
                    <div className="col-md-3 col-lg-2 p-md-4" style={{ height: '90vh' }}>
                        <ProjectStatus version={currentProject} />
                    </div>
                </div>
            </div>
        </div>
    )
}