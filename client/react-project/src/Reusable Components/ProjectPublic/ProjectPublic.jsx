import { useNavigate } from "react-router-dom";
import { getProjectById, getToken } from "../../Utils/requests"
import { useEffect, useState } from "react";

export function ProjectPublic({id}){
    const [projectInfo, setProjectInfo] = useState();

    const navigate = useNavigate();

    const fetchProject = async () => {
        const token = getToken()

        const res = await getProjectById(token, id);

        if(res.status === 401){
            navigate('/login')
        }
        else if(res.status === 200){
            setProjectInfo(res.data)
        }
    }

    useEffect(()=>{
        fetchProject();
    })

    return (
        <div>
            <h1>{projectInfo.name}</h1>
            <p>{projectInfo.description}</p>
        </div>
    )
}