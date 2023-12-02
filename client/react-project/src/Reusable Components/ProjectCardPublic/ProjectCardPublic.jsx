import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Avatar, Group, Text, ActionIcon } from "@mantine/core";
import { IconDownload } from '@tabler/icons-react';
import { StatusBadge } from "../../Components/MainPage/Project/Projects";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { CircularProgress, useMediaQuery } from '@mui/material';

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

export function ProjectCardPublic({ name, description, id, status, version = 'v0.0.0', username }) {
    const [loading, setLoading] = useState();

    function handleCardClick(id) {
        // navigate('/mainpage/projects/' + id);
        alert('todo')
    }

    function handleDownload(){
        alert('todo')
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
                <BootstrapTooltip title="Withdraw submission">
                    <ActionIcon variant="filled" color="red" size="lg" radius="md" onClick={handleDownload}>
                        {loading ? <CircularProgress color='inherit' /> : <IconDownload size="1.1rem" />}
                    </ActionIcon>
                </BootstrapTooltip>
            </Group>
        </Card>
    );
}
