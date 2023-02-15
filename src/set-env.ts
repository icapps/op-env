import fs from 'fs';
import { item, validateCli, FieldAssignment } from '@1password/op-js';

validateCli().catch((error) => {
    // TODO: Stop execution of command
    console.error('CLI is not valid:', error.message);
    process.exit(1);
});

// first two args are node and the script name
const [vault, envFile, title] = process.argv.slice(2);

fs.readFile(envFile, 'utf8', (err, data) => {
    if (err) {
        console.error('err', err);
        process.exit(1);
    }

    const fields: FieldAssignment[] = data
        .split(/\r?\n/)
        .map((line) => [line.split('=')[0], 'concealed', line.split('=')[1]]);

    item.create(fields, { vault, title, category: 'Secure Note' });
});
