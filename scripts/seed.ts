import {seed} from '../src/lib/seed';
import {migrate} from '../src/lib/db';
migrate().then(seed).then(()=>{console.log('Demo seeded. Password: DemoPass!2026');process.exit(0);}).catch(e=>{console.error(e);process.exit(1);});
