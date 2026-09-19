import {writeFileSync} from 'node:fs';
const definitions={
 visits:`visit_type text NOT NULL DEFAULT 'routine',purpose text,outcome text,next_action text,follow_up date,check_in timestamptz,check_out timestamptz,latitude numeric(10,7),longitude numeric(10,7),CHECK(check_out IS NULL OR check_in IS NULL OR check_out>=check_in),`,
 collections:`amount numeric(16,2) NOT NULL CHECK(amount>0),currency text NOT NULL DEFAULT 'EGP',payment_method text NOT NULL CHECK(payment_method IN ('cash','cheque','bank_transfer','instapay','wallet','card','other')),reference text,client_transaction_id uuid NOT NULL,confirmed_by uuid,confirmed_at timestamptz,UNIQUE(company_id,client_transaction_id),`,
 invoices:`amount numeric(16,2) NOT NULL CHECK(amount>=0),currency text NOT NULL DEFAULT 'EGP',reference text NOT NULL,UNIQUE(company_id,reference),`,
 plans:`title text NOT NULL,plan_type text NOT NULL CHECK(plan_type IN ('weekly','monthly','annual')),end_date date NOT NULL,visit_target int NOT NULL DEFAULT 0 CHECK(visit_target>=0),collection_target numeric(16,2) NOT NULL DEFAULT 0 CHECK(collection_target>=0),sales_target numeric(16,2) NOT NULL DEFAULT 0 CHECK(sales_target>=0),new_customer_target int NOT NULL DEFAULT 0 CHECK(new_customer_target>=0),CHECK(end_date>=date),`,
 leaves:`leave_type_id uuid NOT NULL, end_date date NOT NULL,days numeric(6,2) NOT NULL CHECK(days>0),FOREIGN KEY(company_id,leave_type_id) REFERENCES leave_types(company_id,id),CHECK(end_date>=date),CHECK(extract(year from date)=extract(year from end_date)),`
};
let sql='-- Generated relational module tables. Changes belong in a new migration after deployment.\n';
for(const [module,extra] of Object.entries(definitions)){
sql+=`CREATE TABLE ${module} (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),company_id uuid NOT NULL REFERENCES companies,customer_id uuid ${['visits','collections','invoices'].includes(module)?'NOT NULL':''},representative_id uuid NOT NULL,area_id uuid,date date NOT NULL DEFAULT CURRENT_DATE,status text NOT NULL DEFAULT 'submitted' CHECK(status IN ('draft','submitted','reviewed','approved','rejected','confirmed','cancelled','completed')),notes text,details jsonb NOT NULL DEFAULT '{}',${extra}created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),UNIQUE(company_id,id),FOREIGN KEY(company_id,customer_id) REFERENCES customers(company_id,id),FOREIGN KEY(company_id,representative_id) REFERENCES users(company_id,id),FOREIGN KEY(company_id,area_id) REFERENCES areas(company_id,id));\n`;
sql+=`CREATE INDEX ${module}_rep_date_idx ON ${module}(company_id,representative_id,date);\nCREATE INDEX ${module}_customer_date_idx ON ${module}(company_id,customer_id,date);\nALTER TABLE ${module} ENABLE ROW LEVEL SECURITY;\nCREATE POLICY ${module}_read ON ${module} FOR SELECT USING(company_id=app_company() AND (app_scope('${module}',representative_id,area_id) ${module==='invoices'?"OR (app_can('invoices.view_customer_history') AND app_area(area_id))":''}));\nCREATE POLICY ${module}_insert ON ${module} FOR INSERT WITH CHECK(company_id=app_company() AND representative_id=app_user() AND app_can('${module}.create') AND (area_id IS NULL OR app_area(area_id)));\nCREATE POLICY ${module}_update ON ${module} FOR UPDATE USING(company_id=app_company() AND ((representative_id=app_user() AND status='draft' AND app_can('${module}.create')) OR (app_can('${module}.approve') AND (area_id IS NULL OR app_area(area_id))))) WITH CHECK(company_id=app_company());\n`;
}
sql+=`CREATE TABLE plan_items(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),company_id uuid NOT NULL,plan_id uuid NOT NULL,customer_id uuid NOT NULL,date date NOT NULL,activity text NOT NULL,FOREIGN KEY(company_id,plan_id) REFERENCES plans(company_id,id),FOREIGN KEY(company_id,customer_id) REFERENCES customers(company_id,id));\n`;
for(const table of ['companies','users','roles','regions','areas','teams','user_areas','user_roles','customers','customer_assignments','leave_types','leave_balances','approval_workflows','approval_requests','approval_actions','notifications','attachments','audit_logs','plan_items']){
 sql+=`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;\n`;
 let read='true',write='false';
 if(table==='users')read="id=app_user() OR app_can('users.view') OR EXISTS(SELECT 1 FROM user_areas ua WHERE ua.user_id=users.id AND app_area(ua.area_id))";
 if(table==='user_areas')read="user_id=app_user() OR app_can('users.view') OR app_area(area_id)";
 if(table==='customers'){read="deleted_at IS NULL AND app_area(area_id) AND app_can('customers.view')";write="app_area(area_id) AND app_can('customers.edit')";}
 if(table==='areas')read='app_area(id) OR app_can(\'areas.manage\')';
 if(['regions','areas','teams'].includes(table))write="app_can('areas.manage')";
 if(table==='companies')write="app_can('settings.manage')";
 if(['roles','user_roles'].includes(table))write="app_can('roles.manage')";
 if(table==='users')write="app_can('users.edit')";
 if(table==='user_areas')write="app_can('users.edit')";
 if(table==='customer_assignments'){read="EXISTS(SELECT 1 FROM customers c WHERE c.id=customer_id)";write="app_can('customers.edit')";}
 if(table==='leave_balances'){read="user_id=app_user() OR app_can('leaves.manage_balance') OR app_can('leaves.approve')";write="app_can('leaves.manage_balance') OR app_can('leaves.approve')";}
 if(['leave_types','approval_workflows'].includes(table))write="app_can('settings.manage')";
 if(table==='approval_requests'){read="submitted_by=app_user() OR (app_can(module||'.approve') AND (area_id IS NULL OR app_area(area_id)))";write="submitted_by=app_user() OR (app_can(module||'.approve') AND (area_id IS NULL OR app_area(area_id)))";}
 if(table==='approval_actions'){read="EXISTS(SELECT 1 FROM approval_requests r WHERE r.id=request_id)";write="approver_id=app_user() AND EXISTS(SELECT 1 FROM approval_requests r WHERE r.id=request_id AND app_can(r.module||'.approve'))";}
 if(table==='notifications'){read='user_id=app_user()';write='user_id=app_user()';}
 if(table==='attachments'){read="uploaded_by=app_user() OR app_can('customers.view')";write='uploaded_by=app_user()';}
 if(table==='audit_logs'){read="app_can('audit.view')";write='false';}
 if(table==='plan_items'){read='EXISTS(SELECT 1 FROM plans p WHERE p.id=plan_id)';write="EXISTS(SELECT 1 FROM plans p WHERE p.id=plan_id AND p.representative_id=app_user() AND p.status IN ('draft','submitted'))";}
 const tenant=table==='companies'?'id':'company_id';
 sql+=`CREATE POLICY ${table}_read ON ${table} FOR SELECT USING(${tenant}=app_company() AND (${read}));\nCREATE POLICY ${table}_write ON ${table} FOR ALL USING(${tenant}=app_company() AND (${write})) WITH CHECK(${tenant}=app_company() AND (${write}));\n`;
}
sql+=`CREATE POLICY customers_create ON customers FOR INSERT WITH CHECK(company_id=app_company() AND created_by=app_user() AND app_area(area_id) AND app_can('customers.create'));\nCREATE POLICY audit_insert ON audit_logs FOR INSERT WITH CHECK(company_id=app_company() AND user_id=app_user());\nCREATE POLICY notification_insert ON notifications FOR INSERT WITH CHECK(company_id=app_company());\nGRANT USAGE ON SCHEMA public TO fieldforce_app;\nGRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO fieldforce_app;\nREVOKE ALL ON sessions,password_resets,login_attempts FROM fieldforce_app;\nREVOKE INSERT,UPDATE,DELETE ON permissions,role_permissions FROM fieldforce_app;\nREVOKE UPDATE,DELETE ON audit_logs,approval_actions,customer_assignments FROM fieldforce_app;\n`;
writeFileSync('migrations/002_modules_rls.sql',sql);
