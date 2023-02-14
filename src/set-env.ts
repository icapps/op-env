import { exec } from 'child_process';
import fs from 'fs';
// first two args are node and the script name
const [vault, envFile, title] = process.argv.slice(2);

fs.readFile(envFile, 'utf8', (err, data) => {
    if (err) console.log('err', err);

    const lines = data.split(/\r?\n/).map((line) => JSON.stringify(line));

    exec(
        `op item create --category 'Secure Note' --title ${title} --vault ${vault} ${lines.join(
            ' '
        )}`,
        (error) => {
            if (error) console.log('error', error);
        }
    );
});
