import {z} from 'zod';
import {scoped,admin,audit,type Actor,type DB,type Row} from './db';
import {AppError,requirePermission,hashPassword} from './auth';
import {modules,type Module,permissionKeys} from './permissions';
import {customerSchema,schemas,userSchema} from './validation';
import {insert} from './seed';
export const isModule=(m:string):m is Module=>modules.includes(m as Module);
const canRead=(a:Actor,m:string)=>a.permissions.some(p=>p===`${m}.create`||p.startsWith(`${m}.view_`));
const asDate=(v:unknown)=>v instanceof Date?v.toISOString().slice(0,10):String(v).slice(0,10);
export async function getCustomer(db:DB,id:string){const c=(await db.query('SELECT * FROM customers WHERE id=$1',[id])).rows[0];if(!c)throw new AppError('customer_unavailable',404);return c;}
export async function getEntity(db:DB,module:string,id:string){if(module==='customers')return getCustomer(db,id);if(!isModule(module))throw new AppError('not_found',404);const r=(await db.query(`SELECT * FROM ${module} WHERE id=$1`,[id])).rows[0];if(!r)throw new AppError('not_found',404);return r;}
async function notify(db:DB,_a:Actor,user:string,title:string,link:string){await db.query('SELECT app_notify($1,$2,$3,$4)',[user,title,'',link]);}
async function requestApproval(db:DB,a:Actor,module:Module,record:Row){
 const workflow=(await db.query('SELECT steps FROM approval_workflows WHERE module=$1',[module])).rows[0];if(!workflow)throw new AppError('workflow_required');
 await insert(db,'approval_requests',{company_id:a.company_id,module,entity_id:record.id,submitted_by:a.id,area_id:record.area_id,steps:JSON.stringify(workflow.steps)});
 // Recipients are resolved within the tenant and restricted to the record's area.
 const users=(await db.query("SELECT DISTINCT u.id FROM users u JOIN user_roles ur ON ur.user_id=u.id JOIN role_permissions rp ON rp.role_id=ur.role_id WHERE rp.permission=$1 AND u.id<>$2 AND u.active AND (EXISTS(SELECT 1 FROM user_areas ua WHERE ua.user_id=u.id AND ua.area_id=$3) OR EXISTS(SELECT 1 FROM user_roles x JOIN role_permissions p ON p.role_id=x.role_id WHERE x.user_id=u.id AND p.permission='customers.view_all'))",[`${module}.approve`,a.id,record.area_id])).rows;
 for(const u of users)await notify(db,a,String(u.id),'طلب جديد يحتاج إلى اعتماد | Approval required','/approvals');
}
export async function createCustomer(a:Actor,input:unknown){requirePermission(a,'customers.create');const data=customerSchema.parse(input);return scoped(a,async db=>{const r=await insert(db,'customers',{...data,details:JSON.stringify(data.details),company_id:a.company_id,created_by:a.id});await audit(db,a,'created','customers',String(r.id),null,r);return r;});}
export async function editCustomer(a:Actor,id:string,input:unknown){requirePermission(a,'customers.edit');const data=customerSchema.parse(input);return scoped(a,async db=>{const old=await getCustomer(db,id);if(old.area_id!==data.area_id||old.representative_id!==data.representative_id){const reason=String((input as Row).reason||'');if(!reason.trim())throw new AppError('reason_required');await insert(db,'customer_assignments',{company_id:a.company_id,customer_id:id,old_rep:old.representative_id,new_rep:data.representative_id,old_area:old.area_id,new_area:data.area_id,changed_by:a.id,reason});}const values={...data,details:JSON.stringify(data.details)};const keys=Object.keys(values);const r=(await db.query(`UPDATE customers SET ${keys.map((k,i)=>k+'=$'+(i+2)).join(',')},updated_at=now() WHERE id=$1 RETURNING *`,[id,...Object.values(values).map(v=>v??null)])).rows[0];await audit(db,a,'updated','customers',id,old,r);return r;});}
export async function createRecord(a:Actor,module:Module,input:unknown){requirePermission(a,`${module}.create`);const parsed=schemas[module].parse(input);return scoped(a,async db=>{
 const data:Record<string,unknown>={...parsed};const items=data.items as Row[]|undefined;delete data.items;
 if(module==='collections'){
  // Serialize matching transaction IDs, including simultaneous first submissions.
  await db.query("SELECT pg_advisory_xact_lock(hashtext($1))",[a.company_id+String(data.client_transaction_id)]);
  const existing=(await db.query('SELECT * FROM collections WHERE client_transaction_id=$1',[data.client_transaction_id])).rows[0];
  if(existing){if(existing.representative_id!==a.id||existing.customer_id!==data.customer_id||String(existing.amount)!==decimal(String(data.amount))||existing.currency!==data.currency||existing.payment_method!==data.payment_method||asDate(existing.date)!==data.date||String(existing.reference||'')!==String(data.reference||''))throw new AppError('idempotency_conflict',409);return existing;}
 }
 let area:unknown=data.area_id||a.areas[0]||null;
 if(data.customer_id){const c=await getCustomer(db,String(data.customer_id));if(c.status==='suspended')throw new AppError('customer_suspended');area=c.area_id;}
 const company=(await db.query('SELECT settings FROM companies WHERE id=$1',[a.company_id])).rows[0];const settings=company.settings as Row;
 if(module==='visits'&&settings.requireGps&&(data.latitude===undefined||data.longitude===undefined))throw new AppError('gps_required');
 if(module==='plans'&&data.plan_type==='annual'&&!settings.annualPlans)throw new AppError('annual_disabled');
 if(module==='leaves'){
  data.days=Math.round((Date.parse(String(data.end_date))-Date.parse(String(data.date)))/86400000)+1;
  await checkLeave(db,a.id,String(data.leave_type_id),String(data.date),String(data.end_date),Number(data.days));
 }
 const record=await insert(db,module,{...data,details:JSON.stringify(data.details),company_id:a.company_id,representative_id:a.id,area_id:area});
 if(module==='plans')for(const item of items||[]){await getCustomer(db,String(item.customer_id));if(String(item.date)<String(data.date)||String(item.date)>String(data.end_date))throw new AppError('invalid_dates');await insert(db,'plan_items',{...item,company_id:a.company_id,plan_id:record.id});}
 if(data.status!=='draft')await requestApproval(db,a,module,record);
 await audit(db,a,'created',module,String(record.id),null,record);return record;
});}
export function decimal(v:string){const [whole,fraction='']=v.split('.');return BigInt(whole).toString()+'.'+fraction.padEnd(2,'0');}
async function checkLeave(db:DB,user:string,type:string,start:string,end:string,days:number,exclude?:string){
 const balance=(await db.query('SELECT * FROM leave_balances WHERE user_id=$1 AND leave_type_id=$2 AND year=$3 FOR UPDATE',[user,type,Number(start.slice(0,4))])).rows[0];if(!balance)throw new AppError('leave_balance_missing');
 const conflict=(await db.query("SELECT id FROM leaves WHERE representative_id=$1 AND status IN ('submitted','approved') AND date<=$3 AND end_date>=$2 AND ($4::uuid IS NULL OR id<>$4)",[user,start,end,exclude||null])).rows;if(conflict.length)throw new AppError('leave_overlap');
 const pending=(await db.query("SELECT coalesce(sum(days),0)::text AS days FROM leaves WHERE representative_id=$1 AND leave_type_id=$2 AND status='submitted' AND extract(year from date)=$3 AND ($4::uuid IS NULL OR id<>$4)",[user,type,Number(start.slice(0,4)),exclude||null])).rows[0];
 if(Number(balance.opening)-Number(balance.used)-Number(pending.days)<days)throw new AppError('insufficient_balance');
}
export async function submitDraft(a:Actor,module:Module,id:string){requirePermission(a,`${module}.create`);return scoped(a,async db=>{const row=(await db.query(`SELECT * FROM ${module} WHERE id=$1 FOR UPDATE`,[id])).rows[0];if(!row||row.representative_id!==a.id||row.status!=='draft')throw new AppError('invalid_transition',409);if(row.customer_id)await getCustomer(db,String(row.customer_id));if(module==='leaves')await checkLeave(db,a.id,String(row.leave_type_id),asDate(row.date),asDate(row.end_date),Number(row.days),id);await db.query(`UPDATE ${module} SET status='submitted',updated_at=now() WHERE id=$1`,[id]);await requestApproval(db,a,module,row);await audit(db,a,'submitted',module,id);return {ok:true};});}
export async function decide(a:Actor,id:string,input:unknown){const data=z.object({decision:z.enum(['approved','rejected']),comment:z.string().max(2000).default('')}).parse(input);return scoped(a,async db=>{
 const request=(await db.query('SELECT * FROM approval_requests WHERE id=$1 FOR UPDATE',[id])).rows[0];if(!request)throw new AppError('not_found',404);if(request.status!=='pending')throw new AppError('already_decided',409);
 const module=String(request.module);if(!isModule(module))throw new AppError('invalid_module');requirePermission(a,`${module}.approve`);
 const steps=request.steps as {permission:string;label:string}[];requirePermission(a,steps[Number(request.current_step)].permission);if(request.submitted_by===a.id)throw new AppError('self_approval',403);
 const record=(await db.query(`SELECT * FROM ${module} WHERE id=$1 FOR UPDATE`,[request.entity_id])).rows[0];if(!record||record.status!=='submitted')throw new AppError('invalid_transition',409);
 await insert(db,'approval_actions',{company_id:a.company_id,request_id:id,step:request.current_step,approver_id:a.id,decision:data.decision,comment:data.comment});
 const final=data.decision==='rejected'||Number(request.current_step)+1===steps.length;
 if(final){
  if(module==='leaves'&&data.decision==='approved'){
   await checkLeave(db,String(record.representative_id),String(record.leave_type_id),asDate(record.date),asDate(record.end_date),Number(record.days),String(record.id));
   await db.query('UPDATE leave_balances SET used=used+$1 WHERE user_id=$2 AND leave_type_id=$3 AND year=$4',[record.days,record.representative_id,record.leave_type_id,Number(asDate(record.date).slice(0,4))]);
  }
  const status=data.decision==='approved'&&module==='collections'?'confirmed':data.decision;
  await db.query(`UPDATE ${module} SET status=$2,updated_at=now()${module==='collections'&&status==='confirmed'?',confirmed_by=$3,confirmed_at=now()':''} WHERE id=$1`,module==='collections'&&status==='confirmed'?[request.entity_id,status,a.id]:[request.entity_id,status]);
  await db.query('UPDATE approval_requests SET status=$2 WHERE id=$1',[id,data.decision]);
  await notify(db,a,String(request.submitted_by),`${module}: ${status}`,'/'+module);
 }else{await db.query('UPDATE approval_requests SET current_step=current_step+1 WHERE id=$1',[id]);}
 await audit(db,a,data.decision,module,String(request.entity_id),{status:record.status},{step:request.current_step,comment:data.comment,final});return {ok:true};
});}
export async function snapshot(a:Actor){return scoped(a,async db=>{
 const data:Record<string,unknown>={actor:a};
 for(const table of ['companies','regions','areas','leave_types','leave_balances','notifications','approval_requests','approval_actions','plan_items'])data[table]=(await db.query(`SELECT * FROM ${table} LIMIT 1000`)).rows;
  data.customers=a.permissions.includes('customers.view')?(await db.query('SELECT c.*,a.name AS area_name,reg.name AS region_name,reg.id AS region_id,u.name AS representative_name FROM customers c LEFT JOIN areas a ON a.id=c.area_id LEFT JOIN regions reg ON reg.id=a.region_id LEFT JOIN users u ON u.id=c.representative_id ORDER BY c.created_at DESC LIMIT 1000')).rows:[];
  data.users=(await db.query('SELECT id,name,email,phone,employee_code,active,supervisor_id,created_at FROM users ORDER BY name')).rows;
  data.user_areas=(await db.query('SELECT ua.*,a.name AS area_name,r.name AS region_name,r.id AS region_id FROM user_areas ua LEFT JOIN areas a ON a.id=ua.area_id LEFT JOIN regions r ON r.id=a.region_id')).rows;
  data.roles=(await db.query('SELECT * FROM roles ORDER BY name')).rows;
  data.user_roles=(await db.query('SELECT * FROM user_roles')).rows;
  for(const m of modules)data[m]=canRead(a,m)?(await db.query(`SELECT r.*,u.name AS representative_name,c.name AS customer_name,c.contact_person,c.type AS customer_type,c.phone AS customer_phone,c.latitude AS customer_latitude,c.longitude AS customer_longitude,ar.name AS area_name,reg.name AS region_name FROM ${m} r LEFT JOIN users u ON u.id=r.representative_id LEFT JOIN customers c ON c.id=r.customer_id LEFT JOIN areas ar ON ar.id=r.area_id LEFT JOIN regions reg ON reg.id=ar.region_id ORDER BY r.date DESC,r.created_at DESC LIMIT 1000`)).rows:[];
 data.audit_logs=a.permissions.includes('audit.view')?(await db.query('SELECT a.*,u.name AS user_name FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.created_at DESC LIMIT 300')).rows:[];
 data.approval_workflows=a.permissions.includes('settings.manage')?(await db.query('SELECT * FROM approval_workflows')).rows:[];
 data.role_permissions=a.permissions.includes('roles.view')?(await db.query('SELECT rp.* FROM role_permissions rp JOIN roles r ON r.id=rp.role_id')).rows:[];
 data.permissions=a.permissions.includes('roles.view')?permissionKeys:[];
 data.attachments=(await db.query('SELECT id,module,entity_id,name,mime,size,created_at FROM attachments ORDER BY created_at DESC LIMIT 1000')).rows;
 data.metrics=await metrics(db,a);
 return data;
});}
async function metrics(db:DB,a:Actor){const result:Record<string,unknown>={};
 result.customers=(await db.query('SELECT count(*)::int AS count FROM customers')).rows[0].count;
 for(const m of modules){if(!canRead(a,m))continue;result[m]=(await db.query(`SELECT count(*)::int AS count,count(*) FILTER(WHERE date=(now() AT TIME ZONE (SELECT settings->>'timezone' FROM companies LIMIT 1))::date)::int AS today ${['collections','invoices'].includes(m)?",coalesce(sum(amount) FILTER(WHERE date>=date_trunc('month',now())::date AND status="+(m==='collections'?"'confirmed'":"'approved'")+"),0)::text AS total,coalesce(sum(amount) FILTER(WHERE status='submitted'),0)::text AS pending":''} FROM ${m}`)).rows[0];}
 result.trend=canRead(a,'visits')?(await db.query("SELECT date::text,count(*)::int AS visits FROM visits WHERE date>=CURRENT_DATE-13 GROUP BY date ORDER BY date")).rows:[];
 result.collection_trend=canRead(a,'collections')?(await db.query("SELECT date::text,currency,sum(amount)::text AS amount FROM collections WHERE date>=CURRENT_DATE-13 AND status='confirmed' GROUP BY date,currency ORDER BY date")).rows:[];
 result.activity=(await db.query("SELECT c.id,c.name,c.area_id,max(v.date)::text AS last_visit,(CURRENT_DATE-coalesce(max(v.date),c.created_at::date))::int AS days FROM customers c LEFT JOIN visits v ON v.customer_id=c.id AND v.status NOT IN ('draft','rejected') GROUP BY c.id ORDER BY days DESC LIMIT 50")).rows;
 result.performance=canRead(a,'plans')?(await db.query("SELECT p.id,p.title,p.representative_id,p.visit_target,p.collection_target,p.sales_target,p.new_customer_target,(SELECT count(*)::int FROM visits v WHERE v.representative_id=p.representative_id AND v.date BETWEEN p.date AND p.end_date AND v.status NOT IN ('draft','rejected')) AS actual_visits,(SELECT coalesce(sum(c.amount),0)::text FROM collections c WHERE c.representative_id=p.representative_id AND c.date BETWEEN p.date AND p.end_date AND c.status='confirmed' AND c.currency=(SELECT settings->>'currency' FROM companies LIMIT 1)) AS actual_collections,(SELECT coalesce(sum(i.amount),0)::text FROM invoices i WHERE i.representative_id=p.representative_id AND i.date BETWEEN p.date AND p.end_date AND i.status='approved' AND i.currency=(SELECT settings->>'currency' FROM companies LIMIT 1)) AS actual_sales,(SELECT count(*)::int FROM customers c WHERE c.created_by=p.representative_id AND c.created_at::date BETWEEN p.date AND p.end_date) AS actual_customers FROM plans p ORDER BY p.date DESC LIMIT 100")).rows:[];return result;
}
export async function administer(a:Actor,kind:string,input:unknown){const x=z.record(z.string(),z.unknown()).parse(input);
 if(kind==='users'){requirePermission(a,'users.create');const u=userSchema.parse(input);return admin(async db=>{
  const validRole=(await db.query('SELECT id FROM roles WHERE id=$1 AND company_id=$2',[u.role_id,a.company_id])).rows[0];if(!validRole)throw new AppError('invalid_role');
  const {role_id,area_ids,password,...fields}=u;const r=await insert(db,'users',{...fields,company_id:a.company_id,password_hash:hashPassword(password)});await insert(db,'user_roles',{company_id:a.company_id,user_id:r.id,role_id});for(const id of area_ids)await insert(db,'user_areas',{company_id:a.company_id,user_id:r.id,area_id:id});await audit(db,a,'created','users',String(r.id),null,{name:u.name,email:u.email,role_id,area_ids});return {id:r.id};});}
 if(kind==='user-update'){requirePermission(a,'users.edit');const v=z.object({id:z.uuid(),name:z.string().min(2).max(150),role_id:z.uuid(),area_ids:z.array(z.uuid()),active:z.boolean()}).parse(x);requirePermission(a,'roles.manage');if(!v.active)requirePermission(a,'users.disable');if(v.id===a.id)throw new AppError('self_edit_forbidden');return admin(async db=>{const old=(await db.query('SELECT id,name,active FROM users WHERE id=$1 AND company_id=$2 FOR UPDATE',[v.id,a.company_id])).rows[0];if(!old)throw new AppError('not_found',404);await db.query('UPDATE users SET name=$2,active=$3 WHERE id=$1',[v.id,v.name,v.active]);await db.query('DELETE FROM user_roles WHERE user_id=$1',[v.id]);await insert(db,'user_roles',{company_id:a.company_id,user_id:v.id,role_id:v.role_id});await db.query('DELETE FROM user_areas WHERE user_id=$1',[v.id]);for(const area of v.area_ids)await insert(db,'user_areas',{company_id:a.company_id,user_id:v.id,area_id:area});await db.query('DELETE FROM sessions WHERE user_id=$1',[v.id]);await audit(db,a,'updated','users',v.id,old,v);return {ok:true};});}
 if(kind==='roles'){requirePermission(a,'roles.manage');const v=z.object({id:z.uuid().optional(),name:z.string().min(2).max(100),permissions:z.array(z.enum(permissionKeys as [string,...string[]]))}).parse(x);return admin(async db=>{let id=v.id;if(id){if(!(await db.query('SELECT id FROM roles WHERE id=$1 AND company_id=$2',[id,a.company_id])).rows[0])throw new AppError('not_found',404);if((await db.query('SELECT user_id FROM user_roles WHERE user_id=$1 AND role_id=$2',[a.id,id])).rows.length)throw new AppError('self_edit_forbidden');await db.query('UPDATE roles SET name=$2 WHERE id=$1',[id,v.name]);await db.query('DELETE FROM role_permissions WHERE role_id=$1',[id]);}else id=String((await insert(db,'roles',{company_id:a.company_id,name:v.name})).id);for(const p of new Set(v.permissions))await insert(db,'role_permissions',{role_id:id,permission:p});await audit(db,a,'permissions_changed','roles',id,null,v);return {id};});}
 return scoped(a,async db=>{
  if(kind==='regions'||kind==='areas'){requirePermission(a,'areas.manage');const v=z.object({name:z.string().min(2).max(100),region_id:z.uuid().optional()}).parse(x);if(kind==='areas'&&!v.region_id)throw new AppError('region_required');const r=await insert(db,kind,{company_id:a.company_id,name:v.name,...(kind==='areas'?{region_id:v.region_id}:{})});await audit(db,a,'created',kind,String(r.id));return r;}
  if(kind==='settings'){requirePermission(a,'settings.manage');const v=z.object({brand:z.string().min(2).max(80),companyName:z.string().min(2).max(150),currency:z.string().regex(/^[A-Z]{3}$/),timezone:z.string().refine(v=>{try{new Intl.DateTimeFormat('en',{timeZone:v});return true;}catch{return false;}}),annualPlans:z.boolean(),requireGps:z.boolean(),activityDays:z.coerce.number().int().min(1).max(365),primaryColor:z.string().regex(/^#[0-9a-fA-F]{6}$/)}).parse(x);await db.query('UPDATE companies SET name=$2,settings=$3 WHERE id=$1',[a.company_id,v.companyName,JSON.stringify(v)]);await audit(db,a,'updated','settings',a.company_id,null,v);return {ok:true};}
  if(kind==='workflow'){requirePermission(a,'settings.manage');const v=z.object({module:z.enum(modules),name:z.string().min(2).max(100),steps:z.array(z.object({permission:z.enum(permissionKeys as [string,...string[]]),label:z.string().min(1).max(100)})).min(1).max(8)}).parse(x);await db.query('INSERT INTO approval_workflows(company_id,module,name,steps) VALUES($1,$2,$3,$4) ON CONFLICT(company_id,module) DO UPDATE SET name=excluded.name,steps=excluded.steps',[a.company_id,v.module,v.name,JSON.stringify(v.steps)]);await audit(db,a,'workflow_changed','approval_workflows',null,null,v);return {ok:true};}
  if(kind==='balance'){requirePermission(a,'leaves.manage_balance');const v=z.object({user_id:z.uuid(),leave_type_id:z.uuid(),year:z.coerce.number().int().min(2020).max(2100),opening:z.coerce.number().min(0).max(366)}).parse(x);const used=(await db.query('SELECT used FROM leave_balances WHERE user_id=$1 AND leave_type_id=$2 AND year=$3 FOR UPDATE',[v.user_id,v.leave_type_id,v.year])).rows[0];if(used&&Number(used.used)>v.opening)throw new AppError('insufficient_balance');await db.query('INSERT INTO leave_balances(company_id,user_id,leave_type_id,year,opening) VALUES($1,$2,$3,$4,$5) ON CONFLICT(user_id,leave_type_id,year) DO UPDATE SET opening=excluded.opening',[a.company_id,v.user_id,v.leave_type_id,v.year,v.opening]);await audit(db,a,'balance_changed','leave_balances',v.user_id,null,v);return {ok:true};}
  throw new AppError('not_found',404);
 });
}
