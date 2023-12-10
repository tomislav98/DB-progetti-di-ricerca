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

DROP TRIGGER IF EXISTS check_project_status_trigger ON projects;
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
			AND NOW() BETWEEN w.data_start AND w.data_end
	)  THEN
		RETURN NEW;
	END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS check_report_creation_trigger ON reports;
CREATE TRIGGER check_report_creation_trigger
BEFORE INSERT ON reports
FOR EACH ROW
EXECUTE FUNCTION check_report_creation();

/*Controllo se una finestra overlappa oppure se viene creata nel passato*/
CREATE OR REPLACE FUNCTION check_window_constraint()
RETURNS TRIGGER AS $$
BEGIN 
	IF EXISTS(
		SELECT 1
		FROM evaluation_windows w
		WHERE NEW.data_end >= w.data_start AND NEW.data_start <= w.data_end
	) THEN 
	RETURN NULL;
	END IF;

	IF NEW.data_start > NOW() THEN
		RETURN NULL;
	END IF;

	RETURN NEW;
END;


DROP TRIGGER IF EXISTS check_window_constraint_trigger ON evaluation_windows;
CREATE TRIGGER check_window_constraint_trigger
BEFORE INSERT ON evaluation_windows
FOR EACH ROW
EXECUTE FUNCTION check_window_constraint();

