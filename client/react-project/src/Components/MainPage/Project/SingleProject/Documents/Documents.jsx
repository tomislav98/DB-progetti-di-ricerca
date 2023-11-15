import { useState, useEffect } from "react";
import { useMediaQuery, Fab, Box, Chip, Card } from "@mui/material";
import Modal from '@mui/material/Modal';
import DropzoneButton from "../../../../../Reusable Components/Dropzone/DropzoneButton";
import { FeaturesCard } from "./FeaturesCard";
import './documents.scss'
import { Divider, Button, Group } from '@mantine/core'
import { getDocumentsbyId, getLatestVersionByProjectId, getToken } from "../../../../../Utils/requests";

function ProjectDocuments({ documents = [] }) {
    const [addedFiles, setAddedFiles] = useState([]);
    const [fetchedDocs, setFetchedDocs] = useState(documents);
    const [hasUploaded, setHasUploaded] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        setFetchedDocs(documents)
    }, [fetchedDocs, documents])

    function handleFilesUpload(files) {
        console.log(files)
        setAddedFiles(files);
        setHasUploaded(true);
    }

    const handleFileDelete = (index) => {
        const newUploadedFiles = [...addedFiles];
        newUploadedFiles.splice(index, 1);
        setAddedFiles(newUploadedFiles);
    };

    return (
        <div className="full-page-container">
            <div className="documents-modal-container">
                <div className="row row-title">
                    <h2>Your documents</h2>
                </div>
                <div className="row row-documents p-3 overflow-auto justify-content-between">
                    <div className="col-12 col-lg-7 h-100 overflow-auto">
                        <div className="row row-docs-title">
                            <h5>Old documents</h5>
                        </div>
                        <div className="row row-docs-docs">
                            {
                                fetchedDocs.map((val, i) => {
                                    return (
                                        <div className="col-12 col-md-4 col-lg-3"> <FeaturesCard document={fetchedDocs[i]} onChange={()=>setHasChanged(true)} /> </div>
                                    )
                                })
                            }
                        </div>
                        {
                            addedFiles.length > 0 ?
                                <div className="row pt-5">
                                    <h5>Newly added</h5>
                                    {
                                        addedFiles.map((val, i) => {
                                            return (
                                                <div className="col-12 col-md-4 col-lg-3"> <FeaturesCard document={addedFiles[i]} isNewlyAdded={true}  onChange={()=>setHasChanged(true)} /> </div>
                                            )
                                        })
                                    }
                                </div>
                                :
                                null
                        }
                    </div>
                    <div className="col-12 col-lg-1 d-flex justify-content-center">
                        <Divider className="h-100 w-25" orientation="vertical" />
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="row row-title">
                            <h5>Upload new files</h5>
                        </div>
                        <div className="row row-dropzone" >
                            <div className="col-12 col-dropzone">
                                <DropzoneButton onFilesUploaded={handleFilesUpload} onFilesDeleted={handleFileDelete} showUploadedFiles={false} style={{ justifyContent: 'center' }} />
                            </div>
                            {
                                hasUploaded || hasChanged ?
                                    <div className="col-12 ">
                                        <Group justify="center">
                                            <Button size="md">Update project</Button>
                                        </Group>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function DocumentsModal({ projectData, updateProjects, isOpen, onCloseModal, onOpenModal }) {
    const [open, setOpen] = useState(isOpen);
    const [docsList, setDocsList] = useState([]);
    const [dropzoneActive, setDropzoneActive] = useState(false);

    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });

    // TODO: projectData.id fornisce l'id del progetto, prendere l'ultima versione associata ad esso e prendere i documenti della stessa 
    useEffect(() => {
        const fetchAndSetDocsList = async () => {
            const fetchedProjects = [];

            if (projectData) {
                const token = getToken();

                try {
                    const latestVersionRes = await getLatestVersionByProjectId(projectData.id, token);
                    const documentPromises = latestVersionRes.documents.map(async (doc) => {
                        const documentRes = await getDocumentsbyId(doc.doc_id, token);

                        fetchedProjects.push({
                            image_preview: documentRes.image_preview,
                            metadata: documentRes.metadata,
                            id: doc.doc_id,
                        });
                    });

                    await Promise.all(documentPromises);
                } catch (e) {
                    console.error(e);
                } finally {
                    setDocsList(fetchedProjects);
                }
            }
        };

        fetchAndSetDocsList();
    }, [projectData]);


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
                    <ProjectDocuments documents={docsList} />
                </Box>
            </Modal>
        </div>
    );
}