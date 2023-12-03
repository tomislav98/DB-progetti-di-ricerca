import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export function ReportsModal({ reports }) {

    return(
        <div className="table-responsive">
            <table className="table table-striped table-sm">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Project Version ID</th>
                        <th scope="col">Evaluator ID</th>
                        <th scope="col">Created</th>
                        <th scope="col">ID</th>
                        <th scope="col">Vote</th>
                        <th scope="col">Download</th>
                    </tr>
                </thead>
                <tbody>
                    {reports ? (
                        reports.map((report, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{report.version_project_id}</td>
                                <td>{report.evaluator_id}</td>
                                <td>{report.created}</td>
                                <td>{report.id}</td>
                                <td>{report.vote}</td>

                                <td >
                                    <button type="button" className="btn btn-sm btn-outline-secondary mx-4" onClick={async () => { alert(report.pdf_data) }}>
                                        <FontAwesomeIcon icon={faDownload} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>1,001</td>
                            <td>random</td>
                            <td>data</td>
                            <td>placeholder</td>
                            <td>text</td>
                        </tr>
                        // Add more default rows as needed
                    )}
                </tbody>
            </table>
        </div>
    )
}