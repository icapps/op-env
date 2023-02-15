import fs from 'fs';
import { item, FieldAssignment } from '@1password/op-js';

export default function createItemFromFile(
    envFile: string,
    vault: string,
    title: string
): void {
    fs.readFile(envFile, 'utf8', (err, data) => {
        if (err) {
            console.error('err', err);
            process.exit(1);
        }

        const fields: FieldAssignment[] = data
            .split(/\r?\n/)
            .map((line) => [
                line.split('=')[0],
                'concealed',
                line.split('=')[1],
            ]);

        item.create(fields, { vault, title, category: 'Secure Note' });
    });
}
