import { useState, useEffect } from "react";
import { useMediaQuery, Fab, Box } from "@mui/material";
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import ReportPublic from "../../../../Reusable Components/ReportPublic/ReportPublic";
import { getDocumentsbyId, getLatestVersionByProjectId, getReportsByProjectId, getToken } from "../../../../Utils/requests";

const add = <FontAwesomeIcon icon={faAdd}/>

export default function ReportModal({projectData, updateProjects, isOpen, onCloseModal, onOpenModal}) {
    const [open, setOpen] = useState(isOpen);
    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });

    const fetchReports = async () => {

        if( projectData){
            const token = getToken()
            const latestVersion = await getLatestVersionByProjectId(projectData.id, token);
        
            const reports = await getReportsByProjectId(token, projectData.id);

            console.log(reports);
        }

    }

    useEffect(()=>{
        fetchReports()
    },[projectData])

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
                    <ReportPublic/>
                </Box>
            </Modal>
        </div>
    );
}