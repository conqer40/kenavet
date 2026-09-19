import {randomBytes,scryptSync,timingSafeEqual,createHash} from 'node:crypto';
import {admin,audit,type Actor,type DB} from './db';
export class AppError extends Error {constructor(public code:string,public status=400){super(code);}}
export const hashToken=(token:string)=>createHash('sha256').update(token).digest('hex');
export function hashPassword(password:string){const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(password,salt,64).toString('hex');}
export function verifyPassword(password:string,stored:string){const [salt,hash]=stored.split(':');const actual=scryptSync(password,salt||'invalid',64);const expected=Buffer.from(hash||'','hex');return actual.length===expected.length && timingSafeEqual(actual,expected);}
export function requirePermission(actor:Actor,p:string){if(!actor.permissions.includes(p))throw new AppError('forbidden',403);}
export async function actorFromUser(db:DB,id:string):Promise<Actor>{
 const user=(await db.query('SELECT id,company_id,name,email,language FROM users WHERE id=$1 AND active=true',[id])).rows[0];if(!user)throw new AppError('unauthorized',401);
 const permissions=(await db.query('SELECT DISTINCT rp.permission FROM user_roles ur JOIN role_permissions rp ON rp.role_id=ur.role_id WHERE ur.user_id=$1',[id])).rows.map(r=>String(r.permission));
 const areas=(await db.query('SELECT area_id FROM user_areas WHERE user_id=$1',[id])).rows.map(r=>String(r.area_id));return {...user,permissions,areas} as Actor;
}
export async function authenticate(token:string|undefined){if(!token)throw new AppError('unauthorized',401);return admin(async db=>{const session=(await db.query('SELECT user_id FROM sessions WHERE token_hash=$1 AND expires_at>now()',[hashToken(token)])).rows[0];if(!session)throw new AppError('unauthorized',401);return actorFromUser(db,String(session.user_id));});}
export async function login(email:string,password:string,remember=false){
 const result=await admin(async db=>{
  const key=hashToken(email.toLowerCase());
  await db.query("INSERT INTO login_attempts(key) VALUES($1) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN login_attempts.started_at<now()-interval '15 minutes' THEN 1 ELSE login_attempts.attempts+1 END,started_at=CASE WHEN login_attempts.started_at<now()-interval '15 minutes' THEN now() ELSE login_attempts.started_at END",[key]);
  const attempt=(await db.query('SELECT attempts FROM login_attempts WHERE key=$1',[key])).rows[0];if(Number(attempt.attempts)>10)return {error:'rate_limited'};
  const user=(await db.query('SELECT id,password_hash,active FROM users WHERE lower(email)=$1',[email.toLowerCase()])).rows[0];
  const valid=verifyPassword(password,String(user?.password_hash||'dummy:'));
  if(!user||!valid||!user.active)return {error:'invalid_credentials'};
  const actor=await actorFromUser(db,String(user.id)),token=randomBytes(32).toString('hex'),maxAge=remember?60*60*24*30:60*60*12;
  await db.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+$3*interval '1 second')",[hashToken(token),actor.id,maxAge]);await db.query('DELETE FROM login_attempts WHERE key=$1',[key]);await audit(db,actor,'login','users',actor.id);
  return {actor,token,maxAge};
 });if(result.error)throw new AppError(result.error,result.error==='rate_limited'?429:401);return result as {actor:Actor;token:string;maxAge:number};
}
export async function logout(token:string,actor:Actor){await admin(async db=>{await db.query('DELETE FROM sessions WHERE token_hash=$1',[hashToken(token)]);await audit(db,actor,'logout','users',actor.id);});}
