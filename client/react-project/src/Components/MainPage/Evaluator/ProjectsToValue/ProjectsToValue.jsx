import { useEffect, useState } from "react"
import { ProjectCardPublic } from "../../../../Reusable Components/ProjectCardPublic/ProjectCardPublic";
import { getProjectsToValue } from "../../../../Utils/requests";
import { getToken } from "../../../../Utils/requests";
import { Modal, Box } from "@mui/material";
import CreateReportStepper from "./CreateReportStepper";
import {useMediaQuery} from "@mui/material";

export default function ProjectsToValue() {
    const [projects, setProjects] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });

    const fetchProjectToValue = async () => {
        const token = getToken();
        const res = await getProjectsToValue(token);
        console.log(res)
        setProjects([...res.data])
    }
    useEffect(() => {
        try {
            fetchProjectToValue();
        } catch (error) {
            console.log(error.response.status)
            if (error.response.status === 404) {
                console.log("MIMMOOO")
            }
        }
    }, [])


    const onCardClick = (id) => {
        setModalOpen(true)
    }

    const handleClose = () => {
        setModalOpen(false)
    }

    const boxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches? 1000 : 400,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };


    return (
        <div>
            {
                projects.length !== 0 ?
                    <div className='row pt-4' style={{rowGap: '10px'}}>
                        <h3 className='mb-4'>Projects to value</h3>
                        {
                            projects.map((item, index) => {
                                return <div className='col-12 col-lg-4'>
                                    <ProjectCardPublic clickable={true} name={item.name} description={item.description} id={item.id} status={item.status} version={item.version} username={'pippo'} onCardClick={onCardClick} />
                                </div>
                            })

                        }
                    </div>

                    :
                    <p>
                        404 mimmo
                    </p>
            }
            <Modal
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={boxStyle}>
                    <CreateReportStepper />
                </Box>
            </Modal>
        </div>
    )

}