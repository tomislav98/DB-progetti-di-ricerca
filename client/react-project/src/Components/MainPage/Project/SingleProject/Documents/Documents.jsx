import { useState, useEffect } from "react";
import { useMediaQuery, Fab, Box, Chip, Divider } from "@mui/material";
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import DropzoneButton from "../../../../../Reusable Components/Dropzone/DropzoneButton";
import './documents.scss'

const add = <FontAwesomeIcon icon={faAdd} />

function DocumentCard(){

}

function ProjectDocuments() {
    const [addedFiles, setAddedFiles] = useState([]);

    // to be implemented
    function handleFilesUpload(files) {
        setAddedFiles(files)
    }

    const handleFileDelete = (index) => {
        const newUploadedFiles = [...addedFiles];
        newUploadedFiles.splice(index, 1);
        setAddedFiles(newUploadedFiles);
    };

    return (
        <div className="full-page-container" >
            <div className="documents-modal-container">
                <div className="row row-title">
                    <h2>Download and update documents</h2>
                </div>
                <div className="row row-documents">
                    <div className="col-7">
                        ciao
                    </div>
                    <div className="col-5">
                        <div className="row row-dropzone">
                            <div className="col-12 col-dropzone">
                                <DropzoneButton uploadedFilesprops={[]} onFilesUploaded={handleFilesUpload} showUploadedFiles={false} style={{ justifyContent: 'center' }} />
                            </div>

                            <div className="col-12 col-uploaded-files" style={{paddingTop: '25px'}}>
                                {addedFiles.map((file, index) => (
                                    <Chip key={index} label={file.name} onDelete={() => handleFileDelete(index)} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function DocumentsModal({projectData, updateProjects, isOpen, onCloseModal, onOpenModal }) {
    const [open, setOpen] = useState(isOpen);
    // const handleProjectsUpdate = () => updateProjects();
    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });

    useEffect(()=>{
        console.log(projectData)
        // TODO: projectData.id fornisce l'id del progetto, prendere l'ultima versione associata ad e prendere i documenti della stessa 

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

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen])

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <ProjectDocuments />
                </Box>
            </Modal>
        </div>
    );
}