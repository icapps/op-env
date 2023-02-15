import fs from 'fs';
import { item, NotesField } from '@1password/op-js';
import { OutputFileFormat } from 'types';
import { formatValues } from '../formatters/formatter';

export default async function getEnvFrom1Password(
    vault: string,
    name: string,
    format: OutputFileFormat = 'env',
    location?: string,
    environment?: string
): Promise<void> {
    // Get Secure Note from 1password
    const response = item.get(name, { vault });
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

    // Generate files based on output file format
    const files = formatValues({
        values,
        secrets,
        format,
        environment,
    });
    if (!files?.length) {
        console.error('No files were generated');
        process.exit(1);
    }
    await Promise.all(
        files.map(
            (file) =>
                new Promise((resolve) => {
                    // TODO: Implement location (path.join __dirname and location?)
                    fs.writeFile(file.filename, file.content, () =>
                        resolve(true)
                    );
                })
        )
    );

    console.info('Environment variables files successfully generated.');
}
