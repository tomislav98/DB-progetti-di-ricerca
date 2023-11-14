import { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './AdminPanel.scss'
import { ScrollArea } from '@mantine/core';
import { faGauge, faNoteSticky, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { LinksGroup } from '../Project/SingleProject/LinksGroup';
import { NavbarSimple } from '../../../Reusable Components/NavbarSimple/NavbarSimple';

export default function AdminPanel() {
  const [index, setIndex] = useState(0)

  // TODO devi aggiungere un onclick che quando viene cliccato setta lo stato (setIndex(i))

  return <div className='admin-panel-container'>
    <div className='row navbar-row'>
      <div className='col-2 sidebar'>
        <ScrollArea>
          <div>
            <NavbarSimple />
          </div>
        </ScrollArea>
      </div>
      <div className='col-10 content'>
      </div>
    </div>
  </div>
}

function Calendar() {
  return (<LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateCalendar />
  </LocalizationProvider>)
}