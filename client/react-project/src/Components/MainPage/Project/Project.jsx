import Fab from '@mui/material/Fab';
import './project.scss';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const add = <FontAwesomeIcon icon={faAdd}/>

function Project() {

    return (
        <div className='container'>
            <Fab className='my-fab' color="primary" aria-label="add">
                {add}
            </Fab>
        </div>
    )
}

export default Project;