CREATE OR REPLACE FUNCTION check_project_status()
RETURNS TRIGGER AS $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM projects
		WHERE id = NEW.id
		AND (status = 'APPROVED' OR status = 'NOT_APPROVED')
	) THEN
		RAISE EXCEPTION 'Cannot update to APPROVED or NOT_APPROVED if previous project has the same status.';
	END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_project_status_trigger
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION check_project_status();