import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function getKeyAndCert() {
    return {
        key: await readFile(process.env.SSL_KEY_PATH ?? path.join(process.cwd(), 'key.pem')),
        cert: await readFile(process.env.SSL_CERT_PATH ?? path.join(process.cwd(), 'cert.pem'))
    };
}
