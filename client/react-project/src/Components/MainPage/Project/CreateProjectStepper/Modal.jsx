import Box from '@mui/material/Box';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMediaQuery } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fab from '@mui/material/Fab';
import HorizontalLinearStepper from './CreateProject';
import { useState, useEffect } from 'react';

const add = <FontAwesomeIcon icon={faAdd}/>



export default function BasicModal({updateProjects, isOpen, onCloseModal, onOpenModal}) {
    const [open, setOpen] = useState(isOpen);
    const handleProjectsUpdate = () => updateProjects();
    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });

    const handleClose = () => {
        onCloseModal();
        setOpen(false); 
    }
    const handleOpen = () => {
        onOpenModal();
        setOpen(true);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches?'50vw':'90vw',
        bgcolor: 'background.paper',
        borderRadius: '15px',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(()=>{
        setOpen(isOpen);
    })

    return (
        <div>
            <Fab className='my-fab' onClick={handleOpen} color="primary" aria-label="add">
                {add}
            </Fab>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <HorizontalLinearStepper closeEvent={handleClose} updateProjects={handleProjectsUpdate}/>
                </Box>
            </Modal>
        </div>
    );
}
