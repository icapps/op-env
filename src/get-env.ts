import fs from 'fs';
import { item, validateCli, NotesField } from '@1password/op-js';

validateCli().catch((error) => {
    // TODO: Stop execution of command
    console.error('CLI is not valid:', error.message);
});

// first two args are node and the script name
// TODO: param names
const [itemNameOrId, environment] = process.argv.slice(2);

// Get Secure Note from 1password
const response = item.get(itemNameOrId);
const { values, secrets } = (response.fields || []).reduce<{
    values: Record<string, string>;
    secrets: Record<string, string>;
}>(
    (acc, curr) => {
        if ((curr as NotesField).purpose) return acc;
        return {
            values: { ...acc.values, [curr.label]: curr.value },
            secrets: { ...acc.secrets, [curr.label]: curr.reference! },
        };
    },
    {
        values: {},
        secrets: {},
    }
);

// Create .env<.environment> file with all plain values
fs.writeFile(
    `.env${environment ? `.${environment}` : ''}`,
    Object.keys(values)
        .map((key) => `${key}=${values[key]}`)
        .join('\n'),
    () => {}
);

// Create .env.secrets<.environment> file with all references to 1password entries
fs.writeFile(
    `.env.secret${environment ? `.${environment}` : ''}`,
    Object.keys(secrets)
        .map((key) => `${key}=${secrets[key]}`)
        .join('\n'),
    () => {}
);
