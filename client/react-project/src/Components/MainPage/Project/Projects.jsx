import './project.scss';
import BasicModal from './CreateProjectStepper/Modal';
import { IconSearch, IconArrowRight, IconX } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Card, Avatar, Text, Badge, Group, ActionIcon, TextInput, useMantineTheme, rem, UnstyledButton, Menu, RingProgress, Center, Container, Title, Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import axios from 'axios';
import { IconChevronDown } from '@tabler/icons-react';
import jwtDecode from 'jwt-decode';
import { CircularProgress, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Routes, Route } from 'react-router-dom';
import SingleProject from './SingleProject/SingleProject';
import classes from './NothingFoundBackground.module.css';
import { Skeleton } from '@mui/material';
import { submitProject, getDecodedToken, getToken, withdrawProject } from '../../../Utils/requests';

const avatars = [
    'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
];

const data = [
    { label: 'Recent' },
    { label: 'Version' },
    { label: 'Status' },
];

function SortbyPicker() {
    const [opened, setOpened] = useState(false);
    const [selected, setSelected] = useState(data[0]);
    const items = data.map((item) => (
        <Menu.Item
            onClick={() => setSelected(item)}
            key={item.label}
        >
            {item.label}
        </Menu.Item>
    ));

    return (
        <Menu
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
            radius="md"
            width="target"
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton className='control' data-expanded={opened || undefined}>
                    <Group gap="xs">
                        <span className='label'>{selected.label}</span>
                    </Group>
                    <IconChevronDown className='icon' size="1rem" stroke={1.5} />
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>
    );
}

function InputWithButton(props) {
    const theme = useMantineTheme();

    return (
        <TextInput
            className='my-searchbar'
            radius="xl"
            size="md"
            placeholder="Search project"
            rightSectionWidth={42}
            leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
            rightSection={
                <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
                    <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
            }
            {...props}
        />
    );
}

export function StatusBadge(status = 'ProjectStatus.TO_BE_SUBMITTED') {
    switch (status.status) {
        case 'ProjectStatus.TO_BE_SUBMITTED':
            return <Badge className='common-badge badge-2bsubmitted'> DRAFT </Badge>
        case 'ProjectStatus.SUBMITTED':
            return <Badge className='common-badge badge-submitted'> SUBMITTED </Badge>
        case 'ProjectStatus.APPROVED':
            return <Badge className='common-badge badge-approved' > APPROVED </Badge>
        case 'ProjectStatus.NOT_APPROVED':
            return <Badge className='common-badge badge-not-approved' > NOT APPROVED </Badge>
        case 'ProjectStatus.REQUIRES_CHANGES':
            return <Badge className='common-badge badge-changes' > REQUIRES CHANGES </Badge>
        default:
            break;
    }
}

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

function ProjectCard({ name, description, id, status, version = 'v0.0.0', username, onUpdate }) {
    const [loading, setLoading] = useState();

    const navigate = useNavigate();

    function handleCardClick(id) {
        navigate('/mainpage/projects/' + id);
    }

    function handleUpdate(){
        onUpdate()
    }

    async function handleWithdraw() {
        const token = getToken();
        const decodedToken = getDecodedToken();

        try {
            setLoading(true)
            await withdrawProject(decodedToken.user_id, id, token).then((e)=>{
                setLoading(false)
                handleUpdate()
            });
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

        
    }

    async function handleSubmit() {
        const token = getToken();
        const decodedToken = getDecodedToken();

        try {
            setLoading(true)
            await submitProject(decodedToken.user_id, id, token).then((e) => {
                setLoading(false)
                handleUpdate()
            });
        } catch (error) {
            console.log(error)
            setLoading(false)
        }

    }

    return (
        <Card className='justify-content-around my-card' padding="lg" radius="md" style={{ height: '300px' }} >
            <div onClick={() => { handleCardClick(id) }}>

                <Group justify="space-between">
                    <div className='d-flex'>
                        <Avatar src={avatars[0]} />
                        <p className='text-dark' style={{ marginLeft: '10px' }}>{username} </p>
                    </div>
                    <StatusBadge status={status} />
                </Group>

                <Text lineClamp={2} fz="lg" fw={500} mt="md">
                    {name}
                </Text>

                <Text lineClamp={2} fz="sm" c="dimmed" mt={5}>
                    {description}
                </Text>

                <Text c="dimmed" fz="sm" mt="md">
                    Version:{' '}
                    {version}
                </Text>
            </div>

            <Group justify="space-between" mt="md" style={{ cursor: 'default' }}>
                <Avatar.Group spacing="sm">
                    <Avatar src={avatars[0]} radius="xl" />
                    <Avatar src={avatars[1]} radius="xl" />
                    <Avatar src={avatars[2]} radius="xl" />
                    <Avatar radius="xl">+5</Avatar>
                </Avatar.Group>
                {status === 'ProjectStatus.SUBMITTED' ?
                    <BootstrapTooltip title="Withdraw submission">
                        <ActionIcon variant="filled" color="grey" size="lg" radius="md" onClick={handleWithdraw}>
                            {loading ? <CircularProgress color='inherit'/> : <IconX size="1.1rem" />}
                        </ActionIcon>
                    </BootstrapTooltip>
                    :
                    <BootstrapTooltip title="Submit project">
                        <ActionIcon variant="default" size="lg" radius="md" onClick={handleSubmit}>
                            {loading ? <CircularProgress /> : <IconUpload size="1.1rem" />}
                        </ActionIcon>
                    </BootstrapTooltip>
                }
            </Group>
        </Card>
    );
}

export function Illustration(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 362 145" {...props}>
            <path
                fill="white"
                d="M62.6 142c-2.133 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2L58.2 4c.8-1.333 2.067-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .667.533 1 1.267 1 2.2v21.2c0 .933-.333 1.733-1 2.4-.667.533-1.467.8-2.4.8H93v20.8c0 2.133-1.067 3.2-3.2 3.2H62.6zM33 90.4h26.4V51.2L33 90.4zM181.67 144.6c-7.333 0-14.333-1.333-21-4-6.666-2.667-12.866-6.733-18.6-12.2-5.733-5.467-10.266-13-13.6-22.6-3.333-9.6-5-20.667-5-33.2 0-12.533 1.667-23.6 5-33.2 3.334-9.6 7.867-17.133 13.6-22.6 5.734-5.467 11.934-9.533 18.6-12.2 6.667-2.8 13.667-4.2 21-4.2 7.467 0 14.534 1.4 21.2 4.2 6.667 2.667 12.8 6.733 18.4 12.2 5.734 5.467 10.267 13 13.6 22.6 3.334 9.6 5 20.667 5 33.2 0 12.533-1.666 23.6-5 33.2-3.333 9.6-7.866 17.133-13.6 22.6-5.6 5.467-11.733 9.533-18.4 12.2-6.666 2.667-13.733 4-21.2 4zm0-31c9.067 0 15.6-3.733 19.6-11.2 4.134-7.6 6.2-17.533 6.2-29.8s-2.066-22.2-6.2-29.8c-4.133-7.6-10.666-11.4-19.6-11.4-8.933 0-15.466 3.8-19.6 11.4-4 7.6-6 17.533-6 29.8s2 22.2 6 29.8c4.134 7.467 10.667 11.2 19.6 11.2zM316.116 142c-2.134 0-3.2-1.067-3.2-3.2V118h-56c-2 0-3-1-3-3V92.8c0-1.333.4-2.733 1.2-4.2l56.6-84.6c.8-1.333 2.066-2 3.8-2h28c2 0 3 1 3 3v85.4h11.2c.933 0 1.733.333 2.4 1 .666.533 1 1.267 1 2.2v21.2c0 .933-.334 1.733-1 2.4-.667.533-1.467.8-2.4.8h-11.2v20.8c0 2.133-1.067 3.2-3.2 3.2h-27.2zm-29.6-51.6h26.4V51.2l-26.4 39.2z"
            />
        </svg>
    );
}

function ProjectsSkeleton() {
    const skeletonItems = [];

    for (let i = 0; i < 6; i++) {
        skeletonItems.push(
            <div className='col-12 col-md-6 col-lg-4' key={i} >
                <Card style={{ height: '300px' }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} />
                    <Skeleton variant="rectangular" width={'100%'} height={60} />
                    <Skeleton variant="rounded" width={'100%'} height={60} />
                </Card>
            </div>

        );
    }

    return (
        skeletonItems
    );
}

export function NothingFoundBackground({ openModal }) {
    function handleClick() {
        openModal();
    }
    return (
        <Container className={classes.mantineroot}>
            <div className={classes.mantineinner}>
                <Illustration className={classes.mantineimage} />
                <div className={classes.mantinecontent}>
                    <Title className={classes.mantinetitle} style={{ marginBottom: '35px' }}>Nothing to see here</Title>
                    <Text classNames='' c="dimmed" size="lg" ta="center" className={classes.mentinedescription} style={{ margin: '10px', marginBottom: '25px' }}>
                        Welcome! It seems like you haven't started any projects yet,
                        but don't worry,
                        you can kickstart your journey by simply clicking the inviting button below to create your very first project.
                    </Text>
                    <Group classNames='' justify="center">
                        <Button size="md" onClick={handleClick}>Create a new project</Button>
                    </Group>
                </div>
            </div>
        </Container>
    );
}

function ProjectContainer({ onProjectChange }) {
    const [projects, setProjects] = useState([]);
    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });
    const navigate = useNavigate();
    const [approvedProjects, setApprovedProjects] = useState(0);
    const [projectsInfo, setProjectsInfo] = useState({ approved: 0, drafts: 0, changes: 0, submitted: 0, disapproved: 0 })
    const [username, setUsername] = useState('');
    const [isModalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    function fetchProjects() {
        let token = null;
        let user_id = null;

        try {
            token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token,);
            user_id = decodedToken.user_id;
            setUsername(decodedToken.sub);

        } catch (error) {
            navigate('/login')
        }

        setLoading(true);

        axios.get('http://localhost:5000/researchers/' + user_id + '/projects', {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
            .then((response) => {
                let approvedCount = 0;
                let disapprovedCount = 0;
                let draftsCount = 0;
                let changesCount = 0;
                let submittedCount = 0;


                for (const project of response.data) {
                    if (project.status === 'ProjectStatus.APPROVED') {
                        approvedCount++;
                    }
                    else if (project.status === 'ProjectStatus.NOT_APPROVED') {
                        disapprovedCount++;
                    }
                    else if (project.status === 'ProjectStatus.TO_BE_SUBMITTED') {
                        draftsCount++;
                    }
                    else if (project.status === 'ProjectStatus.REQUIRES_CHANGES') {
                        changesCount++;
                    }
                    else if (project.status === 'ProjectStatus.SUBMITTED') {
                        submittedCount++;
                    }
                }

                const newInfos = {
                    approved: approvedCount, drafts: draftsCount, changes: changesCount, submitted: submittedCount, disapproved: disapprovedCount
                }

                setProjects(response.data.reverse());
                setProjectsInfo(newInfos);
                onProjectChange(response.data.reverse());
            })
            .catch((error) => {
                // Gestisci gli errori qui
                console.error('Errore nella chiamata Axios:', error);
            })
            .finally(() => {
                setLoading(false)
            });
    }

    function handleOpenModal() {
        setModalOpen(true);
    }

    function handleCloseModal() {
        setModalOpen(false);
    }

    function handleSubmit(){
        fetchProjects()
    }

    useEffect(() => {
        fetchProjects();
    }, []);


    return (
        <div className='container-flex my-projects-container example'>
            <div className='row my-full-row justify-content-around'>
                <div className='col-12 col-lg-9'>
                    <div className='container projects-container'>
                        <div className='row content-row'>
                            <div className='col-12 col-lg-5 '>
                                <InputWithButton />
                            </div>
                            <div className='col-12'>
                                <div className='row header-row'>
                                    <div className='col-8 col-lg-6'>
                                        <h1>I miei progetti</h1>
                                    </div>

                                    <div className='col-4 d-flex align-items-center'>
                                        <div className='row'>
                                            {matches ?
                                                <div className='col-4 d-flex align-items-center'>
                                                    <p className='text-muted small' style={{ margin: 0 }}> Sort by</p>
                                                </div> :
                                                null
                                            }
                                            <div className='col-8'>
                                                <SortbyPicker />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='row cards-row'>
                            {projects.length === 0 ?
                                loading ?
                                    <ProjectsSkeleton />

                                    :
                                    <NothingFoundBackground openModal={handleOpenModal} />
                                :
                                projects.map((proj, i) => {
                                    return (
                                        <div className='col-12 col-md-6 col-lg-4' key={i} pid={proj.id} >
                                            <ProjectCard name={proj.name} description={proj.description} id={proj.id} status={proj.status} username={username} version={proj.version} key={i} onUpdate={handleSubmit}/>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-3' style={{ height: '100%' }}>
                    <div className='total-main-container align-items-center'>
                        <div className='row half-page-container'>
                            <div className='row total-title-row align-items-end'>
                                <h2> Total projects</h2>
                            </div>
                            <div className='row total-title-row align-items-center'>
                                <div className='d-flex total-title-row'>

                                    <RingProgress
                                        size={180}
                                        roundCaps
                                        thickness={8}
                                        sections={[{ value: approvedProjects / projects.length, color: 'lightgreen' }]}
                                        label={
                                            <Center>
                                                <h3> {projects.length} </h3>
                                            </Center>
                                        }
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='container text-center'>
                                    <h5> {approvedProjects} Approved projects </h5>
                                    <p className='text-muted'>of {projects.length} projects</p>
                                </div>
                            </div>
                        </div>
                        <div className='row half-page-container'>
                            <div className='col-12'>
                                <div className='container project-info'>
                                    <div className='d-flex align-items-center'>
                                        <FontAwesomeIcon color='grey' icon={faCircle} style={{ marginRight: '15px' }} />

                                        <div>
                                            <h5 style={{ margin: 0 }}> Drafts </h5>
                                            <p className='text-muted'> {projectsInfo.drafts} projects drafted</p>
                                        </div>

                                    </div>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </div>
                                <div className='container project-info'>
                                    <div className='d-flex align-items-center'>
                                        <FontAwesomeIcon color='lightblue' icon={faCircle} style={{ marginRight: '15px' }} />

                                        <div>
                                            <h5 style={{ margin: 0 }}> Submitted </h5>
                                            <p className='text-muted'> {projectsInfo.submitted} projects submitted</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </div>
                                <div className='container project-info'>
                                    <div className='d-flex align-items-center'>
                                        <FontAwesomeIcon color='lightgreen' icon={faCircle} style={{ marginRight: '15px' }} />
                                        <div>
                                            <h5 style={{ margin: 0 }}> Approved </h5>
                                            <p className='text-muted'> {projectsInfo.approved} projects approved</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </div>
                                <div className='container project-info'>
                                    <div className='d-flex align-items-center'>
                                        <FontAwesomeIcon color='lightcoral' icon={faCircle} style={{ marginRight: '15px' }} />

                                        <div>
                                            <h5 style={{ margin: 0 }}> Not Approved </h5>
                                            <p className='text-muted'> {projectsInfo.disapproved} projects not approved</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </div>
                                <div className='container project-info'>
                                    <div className='d-flex align-items-center'>
                                        <FontAwesomeIcon color='lightsalmon' icon={faCircle} style={{ marginRight: '15px' }} />

                                        <div>
                                            <h5 style={{ margin: 0 }}> Required Changes </h5>
                                            <p className='text-muted'> {projectsInfo.changes} projects that requires changes</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BasicModal updateProjects={fetchProjects} isOpen={isModalOpen} onCloseModal={handleCloseModal} onOpenModal={handleOpenModal} />
        </div>
    )
}

function Projects() {
    const [projects, setProjects] = useState([]);

    function updateProjects(projects) {
        setProjects(projects);
    }

    return (
        <Routes>
            <Route path="/" element={<ProjectContainer onProjectChange={updateProjects} />} />
            <Route path="/*" element={<SingleProject projects={projects} />} />
        </Routes>
    )
}

export default Projects;