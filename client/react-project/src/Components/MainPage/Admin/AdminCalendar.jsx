import { useCallback, useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { getAllEvaluationWindows, getToken } from '../../../Utils/requests';
import moment from 'moment'
import './AdminPanel.scss'
const localizer = momentLocalizer(moment);

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
    const [myEventsList, setMyEventsList] = useState([])

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
            console.log(err)
        }
    }

    const onSelectEvent = useCallback(async (event) => {
        alert(event)
    }, [])

    // TODO vedere come mandare la richiesta
    useEffect(() => {

        fetchAndSetEventWindows()

    }, [])

    return <div className='calendar-content'>
        <h2> Crea una nuova finestra di valutazione</h2>
        <MyCalendar events={myEventsList} onSelectEvent={onSelectEvent} />
    </div>
}