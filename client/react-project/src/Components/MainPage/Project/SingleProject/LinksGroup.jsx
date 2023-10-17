import { useState } from 'react';
import { Group, Box, Collapse, ThemeIcon, Text, UnstyledButton, rem } from '@mantine/core';
import { faCalendar, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import classes from './NavbarLinksGroup.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '@mui/material';

export function LinksGroup({ icon, label, initiallyOpened, links }) {
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    const items = (hasLinks ? links : []).map((link) => (
        <div >
            <Text
                component="a"
                className={classes.mantinelink}
                href={link.link}
                key={link.label}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </Text>
        </div >
    ));

    return (
        <div style={{padding: '10px'}}>
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.mantinecontrol}>
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeIcon variant="light" size={30}>
                            <Icon style={{ width: rem(18), height: rem(18) }} />
                        </ThemeIcon>
                        <Box ml="md">{label}</Box>
                    </Box>
                    {hasLinks && (
                        
                        <FontAwesomeIcon className={classes.mantinechevron}
                        stroke={1.5}
                            style={{
                                width: rem(16),
                                height: rem(16),
                                transform: opened ? 'rotate(-90deg)' : 'none',
                            }}
                        
                        >
                            {faChevronRight}
                        </FontAwesomeIcon>
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}


        </div>
    );
}

const IconCalendarStats = <FontAwesomeIcon>
    {faCalendar}
</FontAwesomeIcon>

const mockdata = {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
        { label: 'Upcoming releases', link: '/' },
        { label: 'Previous releases', link: '/' },
        { label: 'Releases schedule', link: '/' },
    ],
};

export function NavbarLinksGroup() {
    return (
        <Box mih={220} p="md" className='p-5'>
            <LinksGroup {...mockdata} />
        </Box>
    );
}