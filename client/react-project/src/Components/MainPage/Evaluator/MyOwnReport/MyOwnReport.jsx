import { getToken, getEvaluatorReports } from "../../../../Utils/requests";
import { useEffect, useState } from "react"
import { ProjectCardPublic } from "../../../../Reusable Components/ProjectCardPublic/ProjectCardPublic";
import { NothingFound } from "../../../../Reusable Components/NothingFound/NothingFound";

export default function MyOwnReports() {
    const [reports, setReports] = useState([]);

    const fetchReports = async () => {
        const token = getToken();
        const res = await getEvaluatorReports(token);
        console.log(res)
        setReports([...res.data])
    }

    useEffect(() => {
        try {
            fetchReports();
        } catch (error) {
            console.log(error.response.status)
            if (error.response.status === 404) {
                console.log("MIMMOOO")
            }
        }
    }, [])

    return <div>
        {
            reports.length !== 0 ?
                <div className='row pt-4'>
                    <h3 className='mb-4'>Projects to value</h3>
                    {
                        reports.map((item, index) => {
                            return <div className='col-4'> report </div>
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