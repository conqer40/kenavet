import {NextRequest,NextResponse} from 'next/server';
import {randomBytes} from 'node:crypto';
import {z} from 'zod';
import {login,logout,hashToken,hashPassword,AppError} from '@/lib/auth';
import {admin} from '@/lib/db';
import {actor,body,failure} from '@/lib/http';
export async function POST(req:NextRequest,{params}:{params:Promise<{action:string}>}){try{
 const {action}=await params;const input=await body(req);
 if(action==='login'){const v=z.object({email:z.email(),password:z.string().min(1).max(128),remember:z.boolean().optional()}).parse(input);const r=await login(v.email,v.password,v.remember);const response=NextResponse.json({ok:true});response.cookies.set('ff_session',r.token,{httpOnly:true,secure:new URL(process.env.APP_URL||req.url).protocol==='https:',sameSite:'lax',path:'/',maxAge:r.maxAge});return response;}
 if(action==='logout'){const a=await actor(req);await logout(req.cookies.get('ff_session')!.value,a);const r=NextResponse.json({ok:true});r.cookies.delete('ff_session');return r;}
 if(action==='forgot'){
  const {email}=z.object({email:z.email()}).parse(input);if(!process.env.RESET_EMAIL_WEBHOOK)throw new AppError('reset_delivery_unconfigured',503);
  const reset=await admin(async db=>{const key='reset:'+hashToken(email.toLowerCase());await db.query("INSERT INTO login_attempts(key) VALUES($1) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN login_attempts.started_at<now()-interval '1 hour' THEN 1 ELSE login_attempts.attempts+1 END,started_at=CASE WHEN login_attempts.started_at<now()-interval '1 hour' THEN now() ELSE login_attempts.started_at END",[key]);const attempt=(await db.query('SELECT attempts FROM login_attempts WHERE key=$1',[key])).rows[0];if(Number(attempt.attempts)>3)return null;const u=(await db.query('SELECT id FROM users WHERE lower(email)=$1 AND active',[email.toLowerCase()])).rows[0];if(!u)return null;const token=randomBytes(32).toString('hex');await db.query('DELETE FROM password_resets WHERE user_id=$1',[u.id]);await db.query("INSERT INTO password_resets(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '30 minutes')",[hashToken(token),u.id]);return token;});
  if(reset){const r=await fetch(process.env.RESET_EMAIL_WEBHOOK,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.RESET_EMAIL_WEBHOOK_SECRET||''}`},body:JSON.stringify({email,resetUrl:`${process.env.APP_URL}/login?reset=${reset}`}),signal:AbortSignal.timeout(10000)});if(!r.ok)throw new AppError('save_failed',503);}return NextResponse.json({ok:true});
 }
 if(action==='reset'){const v=z.object({token:z.string().length(64),password:z.string().min(12).max(128)}).parse(input);await admin(async db=>{const reset=(await db.query('DELETE FROM password_resets WHERE token_hash=$1 AND expires_at>now() RETURNING user_id',[hashToken(v.token)])).rows[0];if(!reset)throw new AppError('invalid_reset');await db.query('UPDATE users SET password_hash=$2 WHERE id=$1',[reset.user_id,hashPassword(v.password)]);await db.query('DELETE FROM sessions WHERE user_id=$1',[reset.user_id]);});return NextResponse.json({ok:true});}
 throw new AppError('not_found',404);
}catch(e){return failure(e);}}
