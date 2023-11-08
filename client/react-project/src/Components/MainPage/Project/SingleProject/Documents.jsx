import { useState, useEffect } from "react";
import { useMediaQuery, Fab, Box } from "@mui/material";
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from '@fortawesome/free-solid-svg-icons';

const add = <FontAwesomeIcon icon={faAdd}/>

export default function DocumentsModal({updateProjects, isOpen, onCloseModal, onOpenModal}) {
    const [open, setOpen] = useState(isOpen);
    // const handleProjectsUpdate = () => updateProjects();
    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });

    const handleClose = () => {
        onCloseModal();
        setOpen(false); 
    }
    const handleOpen = () => {
        // onOpenModal();
        setOpen(true);
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        height: '90vh',
        bgcolor: 'background.paper',
        borderRadius: '15px',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(()=>{
        setOpen(isOpen);
    },[isOpen])

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    Download and update documents
                </Box>
            </Modal>
        </div>
    );
}