import { useEffect, useState } from "react"
import { ProjectCardPublic } from "../../../../Reusable Components/ProjectCardPublic/ProjectCardPublic";
import { getProjectsToValue } from "../../../../Utils/requests";
import { getToken } from "../../../../Utils/requests";

export default function ProjectsToValue() {
    const [projects, setProjects] = useState([]);
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


    return (
        <div>
            {
                projects.length !== 0 ?
                    <div className='row pt-4'>
                        <h3 className='mb-4'>Projects to value</h3>
                        {
                            projects.map((item, index) => {
                                return <div className='col-4'><ProjectCardPublic name={item.name} description={item.description} id={item.id} status={item.status} version={item.version} username={'pippo'} /></div>
                            })

                        }
                    </div>
                    :
                    <p>
                        404 mimmo
                    </p>
            }
        </div>
    )

}