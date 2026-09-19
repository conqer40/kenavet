import {NextRequest,NextResponse} from 'next/server';
import {actor,body,failure} from '@/lib/http';
import {createCustomer,createRecord,administer,isModule} from '@/lib/service';
import {AppError} from '@/lib/auth';
export async function POST(req:NextRequest,{params}:{params:Promise<{module:string}>}){try{const a=await actor(req),data=await body(req),{module}=await params;const result=module==='customers'?await createCustomer(a,data):isModule(module)?await createRecord(a,module,data):['users','user-update','roles','areas','regions','settings','workflow','balance'].includes(module)?await administer(a,module,data):null;if(!result)throw new AppError('not_found',404);return NextResponse.json(result,{status:201});}catch(e){return failure(e);}}
