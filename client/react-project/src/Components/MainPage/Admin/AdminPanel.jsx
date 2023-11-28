import { useEffect, useState } from 'react';
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
import { getAllEvaluationWindows, getDecodedToken } from '../../../Utils/requests';
const localizer = momentLocalizer(moment);

export default function AdminPanel() {
	const [index, setIndex] = useState(0)
	const events = getAllEvaluationWindows();


	const myEventsList = [
		{
			start: new Date(2023, 11, 1),
			end: new Date(2023, 11, 5),
			title: 'Evento 1',
		},

	];
	useEffect(() => {
		const token = getDecodedToken();
		getAllEvaluationWindows(token).then((evaluationWindows) => {
			myEventsList.append({ start: new Date(evaluationWindows.data_start), end: new Date(evaluationWindows.data_end), title: "Finestra di Valutazione" })
			console.log("MIMMO")
		}).catch((error) => {
			console.error('Error fetching evaluation windows:', error);
		});
	})
	const handleItemClick = (i) => {
		setIndex(i);
		console.log(i);
	};
	const data = [{ link: '', label: 'Evaluation Window', icon: IconCalendarEvent, onClick: () => handleItemClick(0) },
	{ link: '', label: 'Projects', icon: IconFile, onClick: () => handleItemClick(1) }];
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
						<MyCalendar localizer={localizer} myEventsList={myEventsList} />
					</div>
				)}
				{index === 1 && <p>TODO</p>}
			</div>
		</div>
	</div>
}

function MyCalendar({ localizer, myEventsList }) {
	return <div className="myCustomHeight">
		<Calendar
			localizer={localizer}
			events={myEventsList}
			startAccessor="start"
			endAccessor="end"
			style={{ height: 500 }}
		/>
	</div>
}