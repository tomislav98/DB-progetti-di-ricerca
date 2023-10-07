import './project.scss';
import BasicModal from './CreateProjectStepper/Modal';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Card, Avatar, Text, Progress, Badge, Group, ActionIcon, TextInput, useMantineTheme, rem, UnstyledButton, Menu, Image, RingProgress, Center } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import axios from 'axios';
import { IconChevronDown } from '@tabler/icons-react';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import jwtDecode from 'jwt-decode';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faCircle } from '@fortawesome/free-solid-svg-icons';

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

function StatusBadge(status) {
    switch (status.status) {
        case 'ProjectStatus.TO_BE_SUBMITTED':
            console.log('first')
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

function ProjectCard({ name, description, id, status, version = 'v0.0.0' }) {
    return (
        <Card className='justify-content-around' padding="lg" radius="md" style={{ height: '300px' }}>
            <Group justify="space-between">

                <div className='d-flex'>
                    <Avatar src={avatars[0]} />
                    <p className='text-dark' style={{ marginLeft: '10px' }}>My name </p>
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

            <Group justify="space-between" mt="md">
                <Avatar.Group spacing="sm">
                    <Avatar src={avatars[0]} radius="xl" />
                    <Avatar src={avatars[1]} radius="xl" />
                    <Avatar src={avatars[2]} radius="xl" />
                    <Avatar radius="xl">+5</Avatar>
                </Avatar.Group>
                <ActionIcon variant="default" size="lg" radius="md">
                    <IconUpload size="1.1rem" />
                </ActionIcon>
            </Group>
        </Card>
    );
}


function Project() {
    const [projects, setProjects] = useState([]);
    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });
    const navigate = useNavigate();
    const [approvedProjects, setApprovedProjects] = useState(0);
    const [projectsInfo, setProjectsInfo] = useState({ approved: 0, drafts: 0, changes: 0, submitted: 0, disapproved: 0 })

    function fetchProjects() {
        let token = null;
        let user_id = null;

        try {
            token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token,);
            user_id = decodedToken.user_id;
        } catch (error) {
            navigate('/login')
        }

        // La chiamata Axios verrà effettuata quando la componente viene montata
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
                
                setProjects(response.data.reverse());
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

                setProjectsInfo(newInfos);
            })
            .catch((error) => {
                // Gestisci gli errori qui
                console.error('Errore nella chiamata Axios:', error);
            });
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
                                                <div className='col-4'>
                                                    <p className='text-muted small' style={{margin:0}}> Sort by</p>
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
                            <div className='col-12'>
                                <div className='row cards-row'>
                                    {projects.map((proj, i) => {
                                        return (
                                            <div className='col-12 col-sm-12 col-md-6 col-lg-4' key={i}>
                                                <ProjectCard name={proj.name} description={proj.description} id={proj.id} status={proj.status} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-12 col-lg-3'>
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
            <BasicModal updateProjects={fetchProjects}/>
        </div>
    )
}

export default Project;