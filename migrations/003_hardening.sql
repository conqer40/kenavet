ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY role_permissions_read ON role_permissions FOR SELECT USING(EXISTS(SELECT 1 FROM roles r WHERE r.id=role_id));
DROP POLICY attachments_read ON attachments;
CREATE POLICY attachments_read ON attachments FOR SELECT USING(company_id=app_company() AND (
 (module='customers' AND EXISTS(SELECT 1 FROM customers c WHERE c.id=entity_id)) OR
 (module='visits' AND EXISTS(SELECT 1 FROM visits v WHERE v.id=entity_id)) OR
 (module='collections' AND EXISTS(SELECT 1 FROM collections c WHERE c.id=entity_id)) OR
 (module='invoices' AND EXISTS(SELECT 1 FROM invoices i WHERE i.id=entity_id)) OR
 (module='plans' AND EXISTS(SELECT 1 FROM plans p WHERE p.id=entity_id)) OR
 (module='leaves' AND EXISTS(SELECT 1 FROM leaves l WHERE l.id=entity_id))));
DROP POLICY attachments_write ON attachments;
CREATE POLICY attachments_insert ON attachments FOR INSERT WITH CHECK(company_id=app_company() AND uploaded_by=app_user());
CREATE FUNCTION immutable_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Audit records are immutable'; END $$;
CREATE TRIGGER audit_immutable BEFORE UPDATE OR DELETE ON audit_logs FOR EACH ROW EXECUTE FUNCTION immutable_audit();
