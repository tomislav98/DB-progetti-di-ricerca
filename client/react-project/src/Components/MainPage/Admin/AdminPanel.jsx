import { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './AdminPanel.scss'
import { ScrollArea } from '@mantine/core';
import { faGauge, faNoteSticky, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { LinksGroup } from '../Project/SingleProject/LinksGroup';


export default function AdminPanel() {
    const [index, setIndex] = useState(0)
    const mockdata = [
      { label: 'Reports', icon: faGauge, onClickedLink: ()=> {console.log("mimmo fiocosa")}  }, // per vedere i report dell ultima versione, senno fare un tasto sulla versione
      {
          label: 'Update',
          icon: faNoteSticky,
          initiallyOpened: true,
          links: [
              { label: 'Project data', link: '/' },
              { label: 'Single document', link: '/' },
          ],
      },
      {
          label: 'Evaluation Window',
          icon: faCalendar,
          onClickedLink: ()=>{
            alert("msdafnasdfj")
          }
      }
  ];
    //TODO devi aggiungere un onclick che quando viene cliccato setta lo stato (setIndex(i))
    const links = mockdata.map((item, i) => <LinksGroup {...item} key={item.label} />);
   
    return <div className='admin-panel-container'>
    <div className='row navbar-row'> 
        <div className='col-2 sidebar'>
          <ScrollArea>
            <div>
            {links}
            </div>
          </ScrollArea>
        </div>
        <div className='col-10 content'>
        </div>
      </div>
    </div>
  }

function Calendar(){
    return (<LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar />
    </LocalizationProvider>)
}