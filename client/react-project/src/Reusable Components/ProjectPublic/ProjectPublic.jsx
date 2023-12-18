import { useNavigate } from "react-router-dom";
import { getProjectById, getToken } from "../../Utils/requests"
import { useEffect, useState } from "react";
import { StatusBadge } from "../../Components/MainPage/Project/Projects";
import { FeaturesCard } from "../../Components/MainPage/Project/SingleProject/Documents/FeaturesCard";

export function ProjectPublic({ project }) {

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <p className="text-muted">Name:</p><p> {project.name}</p>
                </div>
                <div className="col-12">
                    <p className="text-muted">Description:</p><p> {project.description}</p>
                </div>
                <div className="row" style={{ overflowY: 'scroll', maxHeight: '50vh' }}>

                    {project.latest_version.documents.map((e, i) => {
                        return <div className="col-12 col-md-4 col-lg-3"> <FeaturesCard document={e} key={i} isNewlyAdded={true} isEditable={false} /> </div>
                    })}
                </div>
            </div>
        </div>
    )
}