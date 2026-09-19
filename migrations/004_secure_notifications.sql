CREATE FUNCTION app_notify(target_user uuid, notification_title text, notification_body text, notification_link text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path=public
AS $$
DECLARE notification_id uuid;
BEGIN
  IF app_company() IS NULL OR NOT EXISTS (
    SELECT 1 FROM users WHERE id=target_user AND company_id=app_company() AND active
  ) THEN
    RAISE EXCEPTION 'Invalid notification recipient';
  END IF;
  INSERT INTO notifications(company_id,user_id,title,body,link)
  VALUES(app_company(),target_user,left(notification_title,200),left(notification_body,2000),notification_link)
  RETURNING id INTO notification_id;
  RETURN notification_id;
END $$;
REVOKE ALL ON FUNCTION app_notify(uuid,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_notify(uuid,text,text,text) TO fieldforce_app;
