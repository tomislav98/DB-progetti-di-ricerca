import { useCallback, useEffect, useState } from 'react';
import './AdminPanel.scss'
import { ScrollArea } from '@mantine/core';
import { NavbarSimple } from '../../../Reusable Components/NavbarSimple/NavbarSimple';
import {
	IconCalendarEvent,
	IconFile
} from '@tabler/icons-react';
import AdminCalendar from './AdminCalendar';

export default function AdminPanel() {
	const [index, setIndex] = useState(0)


	const data = [{ link: '', label: 'Evaluation Window', icon: IconCalendarEvent, onClick: () => handleItemClick(0) },
	{ link: '', label: 'Projects', icon: IconFile, onClick: () => handleItemClick(1) }];

	const handleItemClick = (i) => {
		setIndex(i);
	};

	return <div className='admin-panel-container'>
		<div className='row navbar-row'>
			<div className='col-2 sidebar'>
				<ScrollArea>
					<div>
						<NavbarSimple mockData={data}/>
					</div>
				</ScrollArea>
			</div>
			<div className='col-10 content'>
				{index === 0 && (
					<AdminCalendar />
				)}
				{index === 1 && <p>TODO</p>}
			</div>
		</div>
	</div>
}

