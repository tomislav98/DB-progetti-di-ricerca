import { useEffect, useState } from "react";
import { getToken, getAllEvaluationWindows } from "../../Utils/requests";
import { SimpleWindowCard } from "./SimpleWindowCard";

export default function WindowsCalendarPublic() {
    const [windows, setWindows] = useState([]);

    const fetchWindows = async () => {
        const token = getToken();
        const response = await getAllEvaluationWindows(token);

        setWindows([...response])
    }

    useEffect(() => {
        fetchWindows()
    }, [])

    return (
        <div className="public-calendar w-100 h-100">
            <div className="row">

                {windows.map((e, i) => {
                    return <div className="col-12 col-md-3 ">
                        <SimpleWindowCard id={e.id} date_end={e.data_end} date_start={e.data_start} />
                    </div>
                })}
            </div>
        </div>
    )
}