import {NextRequest,NextResponse} from 'next/server';
import {actor,failure} from '@/lib/http';
import {snapshot} from '@/lib/service';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){try{return NextResponse.json(await snapshot(await actor(req)),{headers:{'Cache-Control':'private, no-store'}});}catch(e){return failure(e);}}
