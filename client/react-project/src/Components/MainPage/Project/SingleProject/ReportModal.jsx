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
    const [reports, setReports] = useState([]);
    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });

    const fetchReports = async () => {

        if( projectData){
            const token = getToken()
            const response = await getReportsByProjectId(token, projectData.id);
            
            setReports([...response.data])

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
                <h2 className="mb-3">Project's reports</h2>
                {
                    reports.map((e,index)=>{
                        return <ReportPublic created={e.created} evaluator_name={e.evaluator_name} project_name={e.project_name} vote={e.vote} key={index}/>
                    })
                }
                </Box>
            </Modal>
        </div>
    );
}