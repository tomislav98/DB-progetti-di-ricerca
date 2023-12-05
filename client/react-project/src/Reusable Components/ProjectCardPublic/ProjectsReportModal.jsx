import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export function ReportsModal({ reports }) {
    const downloadPdf = (pdfData, filename) => {
        const byteCharacters = atob(pdfData);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    return (
        <div className="table-responsive">

            <table className="table table-striped table-sm">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">ID</th>
                        <th scope="col">Project title</th>
                        <th scope="col">Evaluator email</th>
                        <th scope="col">Report creation date</th>
                        <th scope="col">Vote</th>
                        <th scope="col">Version</th>
                        <th scope="col">Download</th>

                    </tr>
                </thead>
                <tbody>
                    {reports ? (
                        reports.map((report, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{report.id}</td>
                                <td>{report.project_name}</td>
                                <td>{report.evaluator_name}</td>
                                <td>{report.created}</td>
                                <td>
                                    <button type="button" className="btn btn-sm btn-outline-secondary">
                                        {report.vote}/10
                                    </button>
                                </td>
                                <td>{report.version}</td>
                                <td >
                                    <button type="button" className="btn btn-sm btn-outline-secondary mx-4" onClick={() => downloadPdf(report.pdf_data, `report_${report.id}.pdf`)}>
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