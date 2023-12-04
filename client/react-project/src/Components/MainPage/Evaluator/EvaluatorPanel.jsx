import ProjectsToValue from "./ProjectsToValue/ProjectsToValue";
import { NavbarSimple } from "../../../Reusable Components/NavbarSimple/NavbarSimple";
import { ScrollArea } from "@mantine/core";
import { useState } from "react";
import './Evaluator.scss'
import {
	IconCalendarEvent,
	IconReport
} from '@tabler/icons-react';

export default function EvaluatorPanel() {
	const [index, setIndex] = useState(0)


	const data = [{ link: '', label: 'Projects to value', icon: IconCalendarEvent, onClick: () => handleItemClick(0) },
	{ link: '', label: 'My own Reports', icon: IconReport, onClick: () => handleItemClick(1) }];

	const handleItemClick = (i) => {
		setIndex(i);
	};
	// TODO devi aggiungere un onclick che quando viene cliccato setta lo stato (setIndex(i))

	return <div className='evaluator-panel-container'>
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
					<ProjectsToValue />
				)}
				{index === 1 && <p>Reports</p>}
			</div>
		</div>
	</div>
}