import { useCallback, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import './AdminPanel.scss'
import { ScrollArea } from '@mantine/core';
import { faGauge, faNoteSticky, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { LinksGroup } from '../Project/SingleProject/LinksGroup';
import { NavbarSimple } from '../../../Reusable Components/NavbarSimple/NavbarSimple';
import {
	IconCalendarEvent,
	IconFile
} from '@tabler/icons-react';
import { getAllEvaluationWindows, getDecodedToken, getToken } from '../../../Utils/requests';
const localizer = momentLocalizer(moment);

export default function AdminPanel() {
	const [index, setIndex] = useState(0)
	const [myEventsList, setMyEventsList] = useState([])

	const data = [{ link: '', label: 'Evaluation Window', icon: IconCalendarEvent, onClick: () => handleItemClick(0) },
	{ link: '', label: 'Projects', icon: IconFile, onClick: () => handleItemClick(1) }];


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
	const handleItemClick = (i) => {
		setIndex(i);
		console.log(i);
	};
	// TODO devi aggiungere un onclick che quando viene cliccato setta lo stato (setIndex(i))

	return <div className='admin-panel-container'>
		<div className='row navbar-row'>
			<div className='col-2 sidebar'>
				<ScrollArea>
					<div>
						<NavbarSimple mockData={data} />
					</div>
				</ScrollArea>
			</div>
			<div className='col-10 content'>
				{index === 0 && (
					<div className='calendar-content'>
						<h2> Crea una nuova finestra di valutazione</h2>
						<MyCalendar localizer={localizer} myEventsList={myEventsList} onSelectEvent={onSelectEvent} />
					</div>
				)}
				{index === 1 && <p>TODO</p>}
			</div>
		</div>
	</div>
}

function MyCalendar({ localizer, myEventsList, onSelectEvent }) {
	return <div className="myCustomHeight">
		<Calendar
			localizer={localizer}
			events={myEventsList}
			onSelectEvent={onSelectEvent}
			startAccessor="start"
			endAccessor="end"
			style={{ height: 500 }}
		/>
	</div>
}