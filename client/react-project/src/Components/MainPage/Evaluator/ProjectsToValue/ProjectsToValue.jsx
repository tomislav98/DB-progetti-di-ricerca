import { useEffect, useState } from "react"
import { ProjectCardPublic } from "../../../../Reusable Components/ProjectCardPublic/ProjectCardPublic";
import { getProjectsToValue } from "../../../../Utils/requests";
import { getToken } from "../../../../Utils/requests";
import { Modal, Box } from "@mui/material";
import CreateReportStepper from "./CreateReportStepper";
import { useMediaQuery } from "@mui/material";
import { NothingFound } from "../../../../Reusable Components/NothingFound/NothingFound";

export default function ProjectsToValue() {
    const [projects, setProjects] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const matches = useMediaQuery('(min-width:600px)', { noSsr: true });

    const fetchProjectToValue = async () => {
        const token = getToken();
        const res = await getProjectsToValue(token);
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


    const onCardClick = (item) => {
        setSelectedProjectIndex(item.id);
        setSelectedProject(item);
        setModalOpen(true);
    }

    const handleClose = () => {
        setModalOpen(false)
    }

    const boxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: matches ? 1000 : 400,
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
                    <div className='row pt-4' style={{ rowGap: '10px' }}>
                        <h3 className='mb-4'>Projects to value</h3>
                        {
                            projects.map((item, index) => {
                                return <div className='col-12 col-lg-4'>
                                    <ProjectCardPublic clickable={true} name={item.name} description={item.description} id={item.id} status={item.status} version={item.version} username={'pippo'} onCardClick={() => onCardClick(item)} />
                                </div>
                            })

                        }
                    </div>
                    :
                    <div className="pt-4">
                        <NothingFound title="No projects submitted" text="There are still no projects submitted to this evaluation windows" />
                    </div>
            }
            <Modal
                open={modalOpen}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={boxStyle}>
                    <CreateReportStepper id={selectedProjectIndex} project={selectedProject}/>
                </Box>
            </Modal>
        </div>
    )

}