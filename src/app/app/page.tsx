import {cookies} from 'next/headers';import {redirect} from 'next/navigation';import {authenticate} from '@/lib/auth';import {Workspace} from '@/components/workspace';
export default async function App(){try{await authenticate((await cookies()).get('ff_session')?.value)}catch{redirect('/login')}return <Workspace/>}
