export const modules=['visits','collections','invoices','plans','leaves'] as const;
export type Module=typeof modules[number];
export const permissionKeys=[
 'users.view','users.create','users.edit','users.disable','roles.view','roles.manage','areas.view','areas.manage',
 'customers.view','customers.create','customers.edit','customers.delete','customers.view_all','customers.view_area_only',
 ...modules.flatMap(m=>['create','view_own','view_team','view_all','approve'].map(p=>`${m}.${p}`)),
 'invoices.view_customer_history','leaves.manage_balance','reports.view','reports.export','dashboard.management','audit.view','settings.manage'
];
export const representativePermissions=['customers.view','customers.create','customers.view_area_only','areas.view',...modules.flatMap(m=>[`${m}.create`,`${m}.view_own`])];
