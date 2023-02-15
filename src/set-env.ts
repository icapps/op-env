import fs from 'fs';
import { item, validateCli, FieldAssignment } from '@1password/op-js';
import { Command } from 'commander';

validateCli().catch((error) => {
    // TODO: Stop execution of command
    console.error('CLI is not valid:', error.message);
    process.exit(1);
});

const program = new Command();
program
    .requiredOption('-v, --vault <vault>', 'Vault to create the item in')
    .requiredOption('-f, --env-file <envFile>', 'Path to the env file')
    .requiredOption('-t, --title <title>', 'Title of the item')
    .parse(process.argv);

const { vault, envFile, title } = program.opts();

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
