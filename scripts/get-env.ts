import fs from 'fs';
import { item, NotesField } from '@1password/op-js';
import { OutputFileFormat } from 'types';
import { OnePasswordConnect } from '@1password/connect';
import config from '../src/config';
import { formatValues } from '../formatters/formatter';

type Fields = {
    values: Record<string, string>;
    secrets?: Record<string, string>;
};

function getEnvWithCli(name: string, vault: string): Fields {
    // Get Secure Note from 1password
    const response = item.get(name, { vault });
    return (response.fields || []).reduce<Fields>(
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
}

async function getEnvWithConnect(name: string, vault: string): Promise<Fields> {
    // Create new connector with HTTP Pooling
    const op = OnePasswordConnect({
        serverURL: config.CONNECT_URL,
        token: config.CONNECT_TOKEN,
        keepAlive: true,
    });

    const vaultFromOp = await op.getVault(vault);
    if (!vaultFromOp) throw new Error('Vault not found');
    const itemFromOp = await op.getItemByTitle(vaultFromOp.id!, name);
    return (itemFromOp.fields || []).reduce<{
        values: Record<string, string>;
    }>(
        (acc, curr) => {
            if (curr.purpose) return acc;
            return {
                values: { ...acc.values, [curr.label!]: curr.value! },
            };
        },
        {
            values: {},
        }
    );
}

export default async function getEnvFrom1Password(
    vault: string,
    name: string,
    format: OutputFileFormat = 'env',
    location?: string,
    environment?: string,
    connect?: boolean
): Promise<void> {
    const { values, secrets } = connect
        ? await getEnvWithConnect(name, vault)
        : getEnvWithCli(name, vault);

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
