import { PGlite } from '@electric-sql/pglite';
import { Pool } from 'pg';
import { readdir, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export type Row = Record<string, unknown>;
export interface DB { query<T extends Row = Row>(sql: string, values?: unknown[]): Promise<{rows:T[]}>; }
interface Engine { transaction<T>(fn:(db:DB)=>Promise<T>):Promise<T>; }
const state=globalThis as unknown as {ffDb?:Promise<Engine>};
async function connect():Promise<Engine>{
 if(process.env.DATABASE_URL){
  const pool=new Pool({connectionString:process.env.DATABASE_URL,max:5});
  return {async transaction(fn){const c=await pool.connect();try{await c.query('BEGIN');const r=await fn(c);await c.query('COMMIT');return r;}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}}};
 }
 if(process.env.NODE_ENV==='production' && process.env.ALLOW_LOCAL_DB!=='true')throw new Error('DATABASE_URL is required in production');
 const dir=process.env.LOCAL_DB_PATH||path.join(process.cwd(),'.data','postgres');await mkdir(dir,{recursive:true});
 const pg=new PGlite(dir);
 return {transaction:fn=>pg.transaction(tx=>fn({query:async<T extends Row>(sql:string,values?:unknown[])=>{if(!values){const r=await tx.exec(sql);return {rows:(r.at(-1)?.rows||[]) as T[]};}const r=await tx.query<T>(sql,values);return {rows:r.rows};}}))};
}
export async function database(){return state.ffDb??=connect();}
export async function admin<T>(fn:(db:DB)=>Promise<T>){return (await database()).transaction(fn);}
export async function migrate(){await admin(async db=>{
 await db.query('CREATE TABLE IF NOT EXISTS schema_migrations(name text PRIMARY KEY,applied_at timestamptz NOT NULL DEFAULT now())');
 for(const name of (await readdir(path.join(process.cwd(),'migrations'))).filter(x=>x.endsWith('.sql')).sort()){
  if((await db.query('SELECT name FROM schema_migrations WHERE name=$1',[name])).rows.length)continue;
  const sql=await readFile(path.join(process.cwd(),'migrations',name),'utf8');
  // PostgreSQL's simple protocol accepts complete migration batches.
  await db.query(sql);await db.query('INSERT INTO schema_migrations(name) VALUES($1)',[name]);
 }
});}
export interface Actor {id:string;company_id:string;name:string;email:string;language:string;permissions:string[];areas:string[];}
export async function scoped<T>(actor:Actor,fn:(db:DB)=>Promise<T>){return admin(async db=>{
 await db.query("SELECT set_config('app.company',$1,true),set_config('app.user',$2,true),set_config('app.permissions',$3,true),set_config('app.areas',$4,true)",[actor.company_id,actor.id,JSON.stringify(actor.permissions),JSON.stringify(actor.areas)]);
 await db.query('SET LOCAL ROLE fieldforce_app');return fn(db);
});}
export async function audit(db:DB,actor:Actor,action:string,entity:string,id:string|null,old:unknown=null,value:unknown=null){await db.query('INSERT INTO audit_logs(company_id,user_id,action,entity,entity_id,old_values,new_values) VALUES($1,$2,$3,$4,$5,$6,$7)',[actor.company_id,actor.id,action,entity,id,old===null?null:JSON.stringify(old),value===null?null:JSON.stringify(value)]);}
