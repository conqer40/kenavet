import {NextRequest,NextResponse} from 'next/server';
import {ZodError} from 'zod';
import {AppError,authenticate} from './auth';
export async function actor(req:NextRequest){return authenticate(req.cookies.get('ff_session')?.value);}
export function checkOrigin(req:NextRequest){const origin=req.headers.get('origin');const expected=new URL(process.env.APP_URL||req.url).origin;if(!origin||origin!==expected)throw new AppError('forbidden',403);}
export async function body(req:NextRequest){checkOrigin(req);const raw=await req.text();if(Buffer.byteLength(raw)>1024*1024)throw new AppError('too_large',413);try{return JSON.parse(raw);}catch{throw new AppError('invalid_input');}}
export function failure(error:unknown){if(error instanceof AppError)return NextResponse.json({error:error.code},{status:error.status});if(error instanceof ZodError)return NextResponse.json({error:'invalid_input',fields:error.issues.map(i=>({path:i.path.join('.'),message:i.message}))},{status:422});console.error('Request failed:',error instanceof Error?error.message:'unknown');return NextResponse.json({error:'save_failed'},{status:500});}
