import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
import {actor,body,failure} from '@/lib/http';
import {editCustomer,decide,submitDraft,isModule,getEntity} from '@/lib/service';
import {scoped,audit} from '@/lib/db';
import {AppError,requirePermission} from '@/lib/auth';
export async function GET(req:NextRequest,{params}:{params:Promise<{module:string;id:string}>}){try{const a=await actor(req),{module,id}=await params;z.uuid().parse(id);return NextResponse.json(await scoped(a,db=>getEntity(db,module,id)),{headers:{'Cache-Control':'no-store'}});}catch(e){return failure(e);}}
export async function PATCH(req:NextRequest,{params}:{params:Promise<{module:string;id:string}>}){try{const a=await actor(req),data=await body(req),{module,id}=await params;z.uuid().parse(id);
 if(module==='customers')return NextResponse.json(await editCustomer(a,id,data));
 if(module==='approvals')return NextResponse.json(await decide(a,id,data));
 if(module==='notifications'){await scoped(a,db=>db.query('UPDATE notifications SET read_at=now() WHERE id=$1',[id]));return NextResponse.json({ok:true});}
 if(isModule(module)&&data.action==='submit')return NextResponse.json(await submitDraft(a,module,id));
 if(isModule(module)&&data.action==='cancel'){requirePermission(a,`${module}.approve`);await scoped(a,async db=>{const r=(await db.query(`SELECT * FROM ${module} WHERE id=$1 FOR UPDATE`,[id])).rows[0];if(!r||!['submitted','approved','confirmed'].includes(String(r.status)))throw new AppError('invalid_transition');if(module==='leaves'&&r.status==='approved')await db.query('UPDATE leave_balances SET used=used-$1 WHERE user_id=$2 AND leave_type_id=$3 AND year=extract(year from $4::date)',[r.days,r.representative_id,r.leave_type_id,r.date]);await db.query(`UPDATE ${module} SET status='cancelled' WHERE id=$1`,[id]);await db.query("UPDATE approval_requests SET status='rejected' WHERE entity_id=$1 AND module=$2 AND status='pending'",[id,module]);await audit(db,a,'cancelled',module,id,r,{reason:z.string().min(1).max(2000).parse(data.reason)});});return NextResponse.json({ok:true});}
 throw new AppError('not_found',404);
}catch(e){return failure(e);}}
