import fs from 'fs';
import { item, NotesField } from '@1password/op-js';

export default function getEnvFrom1Password(
    name: string,
    environment?: string
): void {
    // Get Secure Note from 1password
    const response = item.get(name);
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
}
