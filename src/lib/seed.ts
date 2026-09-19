import {admin,type DB} from './db';
import {hashPassword} from './auth';
import {permissionKeys,representativePermissions,modules} from './permissions';
export async function insert(db:DB,table:string,data:Record<string,unknown>){const keys=Object.keys(data);return (await db.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map((_,i)=>'$'+(i+1)).join(',')}) RETURNING *`,keys.map(k=>data[k]===undefined?null:data[k]))).rows[0];}
export async function seed(){await admin(async db=>{
 if((await db.query('SELECT id FROM companies LIMIT 1')).rows.length)return;
 const co=await insert(db,'companies',{name:'هورايزون للصحة الحيوانية | Horizon Animal Health'});const cid=co.id;
 for(const key of permissionKeys)await insert(db,'permissions',{key});
 const roleDefs:Record<string,string[]>={
 'Super Admin':permissionKeys,'General Manager':permissionKeys.filter(p=>!p.startsWith('roles.')&&!p.startsWith('settings.')),
 'Sales Manager':permissionKeys.filter(p=>!p.startsWith('roles.')&&!p.startsWith('settings.')),
 'Area Manager':[...representativePermissions,'users.view','customers.edit','reports.view','reports.export','dashboard.management',...modules.flatMap(m=>[`${m}.view_team`,`${m}.approve`])],
 'Supervisor':[...representativePermissions,'users.view','reports.view','dashboard.management',...modules.flatMap(m=>[`${m}.view_team`,`${m}.approve`])],
 'Representative':representativePermissions,
 'Finance':['customers.view','customers.view_all','users.view','collections.view_all','collections.approve','invoices.view_all','invoices.view_customer_history','invoices.approve','reports.view','reports.export','dashboard.management'],
 'HR':['users.view','leaves.view_all','leaves.approve','leaves.manage_balance','reports.view'],
 'Auditor':['customers.view','customers.view_all','audit.view','reports.view','reports.export',...modules.map(m=>`${m}.view_all`)]};
 const roles:Record<string,unknown>={};for(const [name,permissions] of Object.entries(roleDefs)){const r=await insert(db,'roles',{company_id:cid,name});roles[name]=r.id;for(const p of new Set(permissions))await insert(db,'role_permissions',{role_id:r.id,permission:p});}
 const region=await insert(db,'regions',{company_id:cid,name:'الشرقية'});const areas=[];for(const name of ['الزقازيق','القنايات','بلبيس','منيا القمح'])areas.push(await insert(db,'areas',{company_id:cid,region_id:region.id,name}));
 const people=[['مدير النظام','admin','Super Admin'],['خالد منصور','manager','General Manager'],['محمود عادل','area','Area Manager'],['سارة حسن','supervisor','Supervisor'],['محمد عبد الله','supervisor2','Supervisor'],['أحمد محمد','ahmed','Representative'],['عمر إبراهيم','omar','Representative'],['منة أحمد','menna','Representative'],['مصطفى علي','mostafa','Representative'],['نورهان سمير','nour','Representative'],['يوسف خالد','youssef','Representative'],['هبة محمود','heba','Representative'],['كريم حسن','karim','Representative'],['إيمان عادل','finance','Finance'],['ريم مصطفى','hr','HR']];
 const users=[];const password=hashPassword('DemoPass!2026');for(let i=0;i<people.length;i++){const [name,handle,role]=people[i];const u=await insert(db,'users',{company_id:cid,name,email:handle+'@fieldforce.test',password_hash:password,employee_code:`EMP-${String(i+1).padStart(3,'0')}`,phone:`0101234${String(i+1).padStart(4,'0')}`,...(i>=5&&i<=12?{supervisor_id:users[3].id}:{})});users.push(u);await insert(db,'user_roles',{company_id:cid,user_id:u.id,role_id:roles[role]});for(const a of role==='Representative'?[areas[(i-5)%4]]:areas)await insert(db,'user_areas',{company_id:cid,user_id:u.id,area_id:a.id});}
 await insert(db,'teams',{company_id:cid,name:'فريق الشرقية',supervisor_id:users[3].id});
 const leaveTypes=[];for(const name of ['إجازة سنوية','إجازة عارضة','إجازة مرضية','إجازة بدون أجر'])leaveTypes.push(await insert(db,'leave_types',{company_id:cid,name,paid:name!=='إجازة بدون أجر'}));
 for(const u of users)for(const l of leaveTypes)await insert(db,'leave_balances',{company_id:cid,user_id:u.id,leave_type_id:l.id,year:new Date().getUTCFullYear(),opening:l===leaveTypes[0]?'21':'7'});
 for(const m of modules)await insert(db,'approval_workflows',{company_id:cid,module:m,name:`${m} approval`,steps:JSON.stringify([{permission:`${m}.approve`,label:m==='collections'?'اعتماد المالية':'اعتماد المسؤول'}])});
 const names=['عيادة د. محمد البيطرية','مزرعة النور للدواجن','صيدلية الرحمة البيطرية','شركة الأمل للأعلاف','مزرعة الوادي للإنتاج الحيواني','عيادة د. أحمد حسن','موزع المتحدة للأدوية','مركز الصفوة البيطري'];
 const customers=[];for(let i=0;i<32;i++)customers.push(await insert(db,'customers',{company_id:cid,name:names[i%8]+(i>=8?' - '+areas[Math.floor(i/8)-1].name:''),name_en:['Dr Mohamed Veterinary Clinic','Al Nour Poultry Farm','Al Rahma Veterinary Pharmacy','Al Amal Feed Mill'][i%4]+' '+(i+1),type:['clinic','poultry_farm','pharmacy','feed_mill'][i%4],phone:`01055${String(i+10000)}`,area_id:areas[i%4].id,representative_id:users[5+i%8].id,classification:['A','B','C','VIP'][i%4],address:'شارع المحافظة، '+areas[i%4].name,contact_person:['د. محمد','أ. محمود','د. أحمد'][i%3],created_by:users[0].id}));
 const now=new Date();const dateAt=(back:number)=>{const d=new Date(now);d.setUTCDate(d.getUTCDate()-back);return d.toISOString().slice(0,10);};
 for(const m of ['visits','collections','invoices'] as const)for(let i=0;i<(m==='visits'?48:18);i++){
  const c=customers[i%32];const data:Record<string,unknown>={company_id:cid,customer_id:c.id,representative_id:c.representative_id,area_id:c.area_id,date:dateAt(i%14),status:m==='collections'?(i<5?'submitted':'confirmed'):'approved',notes:'متابعة احتياجات العميل وتأكيد خطة التعاون'};
  if(m==='visits')Object.assign(data,{visit_type:'routine',purpose:'متابعة المنتجات واحتياجات العميل',outcome:'تمت الزيارة بنجاح',follow_up:dateAt(-1-(i%5))});
  else Object.assign(data,{amount:String((i+1)*750),currency:'EGP',reference:`${m==='collections'?'REC':'INV'}-2026-${1000+i}`,...(m==='collections'?{payment_method:['cash','instapay','bank_transfer'][i%3],client_transaction_id:crypto.randomUUID(),details:JSON.stringify({bank:'البنك الأهلي'}),...(i>=5?{confirmed_by:users[13].id,confirmed_at:now.toISOString()}:{})}:{})});
  const row=await insert(db,m,data);if(row.status==='submitted')await insert(db,'approval_requests',{company_id:cid,module:m,entity_id:row.id,submitted_by:row.representative_id,area_id:row.area_id,steps:JSON.stringify([{permission:`${m}.approve`,label:'اعتماد المالية'}])});
 }
 for(let i=0;i<8;i++){
  const u=users[5+i];const plan=await insert(db,'plans',{company_id:cid,representative_id:u.id,area_id:areas[i%4].id,date:dateAt(3),end_date:dateAt(-3),title:'خطة زيارات وتحصيل الأسبوع',plan_type:'weekly',visit_target:20,collection_target:'50000',sales_target:'80000',new_customer_target:5,status:'submitted'});
  await insert(db,'plan_items',{company_id:cid,plan_id:plan.id,customer_id:customers[i].id,date:dateAt(-1),activity:'زيارة متابعة وتحصيل'});
  await insert(db,'approval_requests',{company_id:cid,module:'plans',entity_id:plan.id,submitted_by:u.id,area_id:areas[i%4].id,steps:JSON.stringify([{permission:'plans.approve',label:'اعتماد المشرف'}])});
 }
 for(let i=0;i<3;i++){const u=users[5+i];const l=await insert(db,'leaves',{company_id:cid,representative_id:u.id,area_id:areas[i].id,date:dateAt(-4),end_date:dateAt(-5),days:2,leave_type_id:leaveTypes[0].id,status:'submitted',notes:'ظروف عائلية'});await insert(db,'approval_requests',{company_id:cid,module:'leaves',entity_id:l.id,submitted_by:u.id,area_id:areas[i].id,steps:JSON.stringify([{permission:'leaves.approve',label:'اعتماد المسؤول'}])});}
 for(const u of [users[0],users[3],users[13]])await insert(db,'notifications',{company_id:cid,user_id:u.id,title:'طلبات جديدة تحتاج إلى مراجعتك',body:'راجع مركز الموافقات لمتابعة طلبات الفريق.',link:'/approvals'});
 await insert(db,'audit_logs',{company_id:cid,user_id:users[0].id,action:'demo.seeded',entity:'companies',entity_id:cid});
});}
