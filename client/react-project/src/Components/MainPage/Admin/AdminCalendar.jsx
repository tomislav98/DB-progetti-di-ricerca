import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { getAllEvaluationWindows, getProjectsByWindowId, getToken } from '../../../Utils/requests';
import { Snackbar, Alert, Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Slide from "@mui/material/Slide";
import Fab from '@mui/material/Fab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import moment from 'moment'
import './AdminPanel.scss'
const localizer = momentLocalizer(moment);

const add = <FontAwesomeIcon icon={faAdd} />

function AdminProjects({ windowId }) {
    const [projects, setProjects] = useState([]);

    const fetchProjectsByWindowId = async () => {
        const token = getToken();
        const res = await getProjectsByWindowId(token, windowId);
        setProjects([...res.data])
    }

    useEffect(() => {
        fetchProjectsByWindowId()
    }, [])

    return (
        <div>
            {
                projects.length !== 0 ?
                    <div>
                        {
                            projects.map((item, index) => {
                                return <div> Item: {item.description} Index: {item.id} </div>
                            })

                        }
                    </div>
                    :
                    <p>
                        This window has no projects...
                    </p>
            }
        </div>
    )
}

export function MyCalendar({ events, onSelectEvent }) {

    return <div className="myCustomHeight">
        <Calendar
            localizer={localizer}
            events={events}
            onSelectEvent={onSelectEvent}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
        />
    </div>
}

export function DateInput() {
    const [value, setValue] = useState([]);
    const shortcutsItems = []
    // {
    //     label: 'This Week',
    //     getValue: () => {
    //         const today = Date.now();
    //         return [today., today.endOf('week')];
    //     },
    // }]
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateRangePicker
                slotProps={{
                    shortcuts: {
                        items: shortcutsItems,
                    },
                    actionBar: { actions: [] },
                }}
                calendars={2}
            />
        </LocalizationProvider>
    );
}

export default function AdminCalendar() {
    const [visibleWindowIndex, setVisibleWindowIndex] = useState(null);
    const [myEventsList, setMyEventsList] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState();
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();

    async function fetchAndSetEventWindows() {
        try {
            const token = getToken();
            const windows = await getAllEvaluationWindows(token);
            const eventWindows = windows.map((w) => ({
                start: new Date(w.data_start),
                end: new Date(w.data_end),
                title: `Finestra di Valutazione Id ${w.id}`,
                id: w.id
            }))
            setMyEventsList((prevEvents) => [...eventWindows]);

        } catch (err) {
            if (err.response.status === 401) {
                setSnackbarOpen(true);
                navigate("/login")
            }

        }
    }

    const handleOpen = async () => {
        setModalOpen(true)
    }

    const handleClose = async () => {
        setModalOpen(false)
    }

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


    const onSelectEvent = useCallback(async (event) => {
        setVisibleWindowIndex(event.id);
    }, [])

    // TODO vedere come mandare la richiesta
    useEffect(() => {
        fetchAndSetEventWindows()
    }, [])

    function TransitionLeft(props) {
        return <Slide {...props} direction="left" />
    }

    return (
        <div className='calendar-content'>
            <h2> Finestre di valutazione </h2>
            <MyCalendar events={myEventsList} onSelectEvent={onSelectEvent} />
            {
                visibleWindowIndex ?

                    <AdminProjects windowId={visibleWindowIndex} />
                    :
                    null
            }
            <Fab color={'primary'} className='my-fab' onClick={handleOpen}>
                {add}
            </Fab>
            <Modal
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={boxStyle}>
                    <DateInput />
                </Box>
            </Modal>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} anchorOrigin={{ vertical: "top", horizontal: "center" }} TransitionComponent={TransitionLeft}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    Wrong request!
                </Alert>
            </Snackbar>
        </div>
    )
}