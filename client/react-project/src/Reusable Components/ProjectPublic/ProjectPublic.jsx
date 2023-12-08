import { useNavigate } from "react-router-dom";
import { getProjectById, getToken } from "../../Utils/requests"
import { useEffect, useState } from "react";
import { StatusBadge } from "../../Components/MainPage/Project/Projects";

export function ProjectPublic({project}){

    useEffect(()=>{
        console.log(project)
    },[project])

    return (
        <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <StatusBadge status={project.status}/>
        </div>
    )
}