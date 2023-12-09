import { useEffect, useState } from "react";
import { getToken, getLatestVersionByProjectId, getDocumentsbyId } from "../../../../Utils/requests";
import { FeaturesCard } from "./Documents/FeaturesCard";
import { Modal, Box } from "@mui/material";

export function DocsModal({ projectData, isOpen, onCloseModal }) {
    const [docs, setDocs] = useState([]);
    const [open, setOpen] = useState(isOpen);

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

    const fetchDocs = async () => {
        const token = getToken();

        if (projectData) {
            const latestVersion = await getLatestVersionByProjectId(projectData.id, token);

            const docsId = latestVersion.documents;

            const docs = await Promise.all(docsId.map(async (e) => {
                return await getDocumentsbyId(e.doc_id, token);
            }));

            console.log(docs)

            setDocs([...docs])
        }
    }

    const handleClose = () => {
        onCloseModal();
        setOpen(false);
    }

    useEffect(() => {
        fetchDocs();
    }, [projectData])

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
                    <h1>Latest version's documents</h1>
                    <div className="row row-docs-docs mt-4">
                        {
                            docs.map((val, i) => {
                                return (
                                    <div className="col-12 col-md-4 col-lg-2"> <FeaturesCard document={docs[i]} isEditable={false} /> </div>
                                )
                            })
                        }
                    </div>
                </Box>
            </Modal>
        </div>
    )
}