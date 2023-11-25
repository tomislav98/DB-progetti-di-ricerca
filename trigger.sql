/*Quando un progetto e' in approvato o non, non puo' essere piu' modificato*/
CREATE OR REPLACE FUNCTION check_project_status()
RETURNS TRIGGER AS $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM projects
		WHERE id = NEW.id
		AND (status = 'APPROVED' OR status = 'NOT_APPROVED')
	) THEN
		RETURN NULL;
	END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_project_status_trigger
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION check_project_status();

/* Il report puo essere creato solo per un progetto in una determinata finestra di valutazione e se e' submitted*/
CREATE OR REPLACE FUNCTION check_report_creation()
RETURNS TRIGGER AS $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM version_projects v 
		JOIN projects p ON v.version = p.latest_version AND v.project_id = p.id
		JOIN evaluation_windows w ON p.evaluation_window_id = w.id
		WHERE NEW.version_project_id = v.id
			AND (v.status = 'SUBMITTED') 
			AND NOW() BETWEEN w.data_start AND w.data_end;
	)  THEN
		RETURN NEW;
	END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_report_creation
BEFORE CREATE ON reports
FOR EACH ROW
EXECUTE FUNCTION check_report_creation();