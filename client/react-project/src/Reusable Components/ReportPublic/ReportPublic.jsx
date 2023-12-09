import { ActionIcon } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { saveAs } from "file-saver";
import { getToken, downloadDocumentsbyId } from "../../Utils/requests";

export default function ReportPublic({ created, evaluator_name, report_id, pdf_data, project_name, project_version_id, vote }) {

  const handleDownload = async () => {
    const blob = new Blob([pdf_data], { type: 'application/pdf' });
    const filename = `[REPORT] ${project_name} ${created}`;
    saveAs(blob, filename)
  }
  
  
  return (
    <div className="report-card my-card p-3" style={{ maxWidth: "300px", border: '1px solid gainsboro' }}>
      <div className="row">
        <div className="col-6">
          <h3>Vote: {vote}/5 </h3>
        </div>
        <div className="col-6">
          <ActionIcon variant="default" color="grey" size="lg" radius="md" onClick={handleDownload}>
            <IconDownload size="1.1rem" />
          </ActionIcon>
        </div>
        <div className="col-6">
          <small className="text-muted">{evaluator_name}</small>
        </div>
        <div className="col-6">
          <small className="text-muted">{created}</small>
        </div>
      </div>
    </div>
  );
}