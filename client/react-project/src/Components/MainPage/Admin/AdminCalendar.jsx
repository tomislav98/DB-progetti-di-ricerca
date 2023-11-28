import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { getAllEvaluationWindows, getProjectsByWindowId, getToken } from '../../../Utils/requests';
import { Snackbar, Alert } from '@mui/material';
import Slide from "@mui/material/Slide";
import Fab from '@mui/material/Fab';
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

export default function AdminCalendar() {
    const [visibleWindowIndex, setVisibleWindowIndex] = useState(null);
    const [myEventsList, setMyEventsList] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState();

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
            <Fab color={'primary'} className='my-fab'>
                {add}
            </Fab>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} anchorOrigin={{ vertical: "top", horizontal: "center" }} TransitionComponent={TransitionLeft}>
                <Alert  severity="error" sx={{ width: '100%' }}>
                    Wrong request!
                </Alert>
            </Snackbar>
        </div>
    )
}