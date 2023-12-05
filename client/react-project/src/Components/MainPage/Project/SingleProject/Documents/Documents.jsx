import { useState, useEffect, version } from "react";
import { Box, TextField } from "@mui/material";
import Modal from '@mui/material/Modal';
import DropzoneButton from "../../../../../Reusable Components/Dropzone/DropzoneButton";
import { FeaturesCard } from "./FeaturesCard";
import './documents.scss'
import { Divider, Button, Group } from '@mantine/core'
import { getDecodedToken, getDocumentsbyId, getLatestVersionByProjectId, getToken, updateProject } from "../../../../../Utils/requests";
import { DocumentType } from "../../../../../Utils/enums";

function ProjectDocuments({ documents = [], projectId, nameProp, descriptionProp, versionProp, onSuccess, onFailure }) {
    const [addedFiles, setAddedFiles] = useState([]);
    const [fetchedFiles, setFetchedFiles] = useState(documents);
    const [hasUploaded, setHasUploaded] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(nameProp ? nameProp : '');
    const [description, setDescription] = useState(descriptionProp ? descriptionProp : '');
    const [version, setVersion] = useState(versionProp ? versionProp : '');


    useEffect(() => {
        setName(nameProp);
    }, [nameProp])

    useEffect(() => {
        setFetchedFiles(documents)
    }, [fetchedFiles, documents])

    function handleFilesUpload(files) {
        setAddedFiles(files);
        setHasUploaded(true);
    };

    const handleFileDelete = (index) => {
        const newUploadedFiles = [...addedFiles];
        newUploadedFiles.splice(index, 1);
        setAddedFiles(newUploadedFiles);
    };

    const handleUpdateButton = async () => {
        try {
            const token = getToken();
            const decodedToken = getDecodedToken();

            const new_files_metadata = [];

            new_files_metadata.push(
                ...fetchedFiles.map(x => ({
                    title: x.metadata.name,
                    type: x.metadata.type_document,
                    id: x.id
                }))
            );

            new_files_metadata.push(
                ...addedFiles.map(x => ({
                    filename: x.path,
                    title: x.name,
                    type: x.docType ? x.docType : 'UNDEFINED'
                }))
            );


            setLoading(true);

            const formData = new FormData();
            formData.append('version', version);
            formData.append('description', description);
            formData.append('name', name);
            addedFiles.forEach((file) => {
                formData.append('files', file);
            });
            formData.append('new_files_metadata', JSON.stringify(new_files_metadata));

            const res = await updateProject(decodedToken.user_id, projectId, token, formData);

            console.log(res)

            if (res.status === 200)
                onSuccess();

        } catch (error) {
            onFailure(error.response.status, error.response.data.error);
        } finally {
            setLoading(false);
        }
    };


    const handleChangeProject = (type, title, id = undefined) => {
        setHasChanged(true)

        if (id) {
            for (const x of fetchedFiles) {
                if (x.id === id) {
                    x.metadata.type_document = DocumentType.getStringFromValue(type);
                }
            }
        }
        else {
            for (const x of addedFiles) {
                if (x.name === title) {
                    x.docType = DocumentType.getStringFromValue(type);
                }
            }
        }

    }

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
                                fetchedFiles.map((val, i) => {
                                    return (
                                        <div className="col-12 col-md-4 col-lg-3"> <FeaturesCard document={fetchedFiles[i]} onChange={handleChangeProject} /> </div>
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
                                                <div className="col-12 col-md-4 col-lg-3"> <FeaturesCard document={addedFiles[i]} isNewlyAdded={true} onChange={handleChangeProject} /> </div>
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
                    <div className="col-12 col-lg-4 overflow-auto">
                        <div className="row row-info">
                            <h5> Update project info </h5>
                        </div>
                        <div className="row row-inputs p-3">

                            <div className="col-8">
                                <TextField className="w-100" id="standard-basic" label="Title" variant="standard" placeholder={name} onChange={(event) => { setName(event.target.value); setHasChanged(true) }} />
                            </div>
                            <div className="col-4 ">
                                <TextField className="w-100" id="standard-basic" label="Version" variant="standard" autoFocus placeholder={version} onChange={(event) => { setVersion(event.target.value); setHasChanged(true) }} />
                            </div>
                            <div className="col-12 ">
                                <TextField className="w-100" id="standard-basic" label="Description" variant="standard" placeholder={description} multiline rows={4} onChange={(event) => { setDescription(event.target.value); setHasChanged(true) }} />
                            </div>
                        </div>

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
                                            <Button size="md" onClick={handleUpdateButton} loading={loading}>Update project</Button>
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

export default function DocumentsModal({ projectData, isOpen, onCloseModal }) {
    const [open, setOpen] = useState(isOpen);
    const [docsList, setDocsList] = useState([]);
    const [updateFailed, setUpdateFailed] = useState(false);
    const [failedStatusCode, setFailedStatusCode] = useState(0);
    const [failureMessage, setFailureMessage] = useState('')

    // startup effects
    useEffect(() => {
        setOpen(isOpen);
        setUpdateFailed(false);
    }, [isOpen])


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
                            pdf_data: documentRes.pdf_data,
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

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: updateFailed ? '50vw' : '90vw',
        height: '90vh',
        bgcolor: 'background.paper',
        borderRadius: '15px',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const handleFailedUpdate = (status, message) => {
        setUpdateFailed(true);
        setFailedStatusCode(status);
        setFailureMessage(message)
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {updateFailed ?
                    <Box sx={style}>
                        <UpdateFailed status={failedStatusCode} message={failureMessage} onCloseModal={onCloseModal} />
                    </Box>
                    :
                    <Box sx={style}>
                        <ProjectDocuments documents={docsList}
                            projectId={projectData.id}
                            nameProp={projectData.name}
                            descriptionProp={projectData.description}
                            versionProp={projectData.version}
                            onSuccess={() => onCloseModal()}
                            onFailure={handleFailedUpdate}
                        />

                    </Box>
                }

            </Modal>
        </div>
    );
}

function UpdateFailed({ status, message, onCloseModal }) {

    useEffect(() => {
        setTimeout(() => {
            onCloseModal()
        }, 6000)
    })

    return (
        <div className="container py-5">
            <div className="p-5 text-center bg-body-tertiary">
                <svg className="bi mt-5 mb-3" width="48" height="48">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-check2-circle" viewBox="0 0 16 16">
                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                    </svg>
                </svg>
                <h1 className="text-body-emphasis">Update non effettuato</h1>
                <p className="col-lg-6 mx-auto mb-4 text-muted">
                    Ci dispiace ma c'è stato un errore, questo modale verrà automaticamente chiuso fra qualche secondo.
                    Codice errore {status}.
                    <br />
                    <p className="text-danger">{message}</p>
                </p>
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}