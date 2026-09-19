import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const tempDir = path.join('D:', 'CRM', 'temp_docx_build');
const outputDocx = path.join('D:', 'CRM', 'docs', 'FieldForce_Pro_User_Guide.docx');

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(path.join(tempDir, '_rels'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'docProps'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'word', '_rels'), { recursive: true });

console.log('Folders created successfully at', tempDir);
