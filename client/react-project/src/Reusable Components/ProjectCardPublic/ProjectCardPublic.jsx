import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Avatar, Group, Text, ActionIcon } from "@mantine/core";
import { IconDownload, IconEye, IconReceipt } from '@tabler/icons-react';
import { StatusBadge } from "../../Components/MainPage/Project/Projects";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { CircularProgress, useMediaQuery, Modal, Box } from '@mui/material';
import { getToken, getReportsByProjectId } from "../../Utils/requests";
import { ReportsModal } from "./ProjectsReportModal";

const avatars = [
    'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
];

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

const boxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export function ProjectCardPublic({ name, description, id, status, version = 'v0.0.0', username, evaluable = false }) {
    const [loading, setLoading] = useState();
    const [reports, setReports] = useState();
    const [modalOpen, setModalOpen] = useState(false);

    const fetchReports = async () => {
        const token = getToken();
        const res = await getReportsByProjectId(token, id);
        setReports(res.data);
    }

    useEffect(() => {
        fetchReports();
    }, [])

    function handleCardClick(id) {
        // navigate('/mainpage/projects/' + id);
        alert('todo')
    }

    function handleDownload() {
        alert('todo')
    }

    const handleClose = async () => {
        setModalOpen(false)
    }

    const handleOpen = async () => {
        setModalOpen(true)
    }

    return (
        <Card className='justify-content-around' padding="lg" radius="md" style={{ height: '300px' }} >
            <div onClick={() => { handleCardClick(id) }}>
                <Group justify="space-between">
                    <div className='d-flex w-100'>
                        <div className="col-6">
                            <h5>Total reports: </h5>
                        </div>
                        <div className="col-3">
                        </div>
                        <div className="col-3">
                            <p> {reports ? reports.length : 0} </p>
                        </div>
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
                <div className="d-flex">
                    <BootstrapTooltip  title="Download project's documents">
                        <ActionIcon variant="light" color="grey" size="lg" radius="md" onClick={handleDownload}>
                            {loading ? <CircularProgress color='inherit' /> : <IconDownload size="1.1rem" />}
                        </ActionIcon>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="View reports">
                        <ActionIcon variant="filled" color="grey" size="lg" radius="md" onClick={handleOpen} disabled={reports? reports.length === 0 : true}>
                            {loading ? <CircularProgress color='inherit' /> : <IconEye size="1.1rem" />}
                        </ActionIcon>
                    </BootstrapTooltip>
                    {evaluable ?
                        <BootstrapTooltip title="View reports">
                            <ActionIcon variant="filled" color="blue" size="lg" radius="md" onClick={handleDownload}>
                                {loading ? <CircularProgress color='inherit' /> : <IconReceipt size="1.1rem" />}
                            </ActionIcon>
                        </BootstrapTooltip>
                        :
                        null
                    }
                </div>
            </Group>
            <Modal
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={boxStyle}>
                    <ReportsModal reports={reports}/>
                </Box>
            </Modal>
        </Card>
    );
}
