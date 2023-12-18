import { getToken, getEvaluatorReports } from "../../../../Utils/requests";
import { useEffect, useState } from "react"
import { ProjectCardPublic } from "../../../../Reusable Components/ProjectCardPublic/ProjectCardPublic";
import ReportPublic from "../../../../Reusable Components/ReportPublic/ReportPublic";
import { NothingFound } from "../../../../Reusable Components/NothingFound/NothingFound";

export default function MyOwnReports() {
    const [reports, setReports] = useState([]);

    const fetchReports = async () => {
        const token = getToken();
        const res = await getEvaluatorReports(token);
        setReports([...res.data])
    }

    useEffect(() => {
        try {
            fetchReports();
        } catch (error) {
            if (error.response.status === 404) {
            }
        }
    }, [])

    return <div>
        {
            reports.length !== 0 ?
                <div className='row pt-4'>
                    <h3 className='mb-4'>My own reports</h3>
                    {
                        reports.map((item, index) => {
                            return <div className='col-4'> <ReportPublic created={item.created} evaluator_name={item.evaluator_email} vote={item.vote}/> </div>
                        })

                    }
                </div>
                :
                <div className="pt-4">
                    <NothingFound
                        title="No reports found"
                        text="You still haven't submitted any report. Press on Projects to value section to see what projects are available to be evaluated." 
                    />
                </div>
        }
    </div>
}