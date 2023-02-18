import fs from 'fs';
import { item, NotesField } from '@1password/op-js';

import { OnePasswordConnect } from '@1password/connect';

function getEnvWithCli(
    name: string,
    vault: string,
    environment?: string
): void {
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

    // Create .env<.environment> file with all plain values
    fs.writeFile(
        `.env${environment ? `.${environment}` : ''}`,
        Object.keys(values)
            .map((key) => `${key}=${values[key]}`)
            .join('\n'),
        () => {}
    );

    // // Create .env.secrets<.environment> file with all references to 1password entries
    fs.writeFile(
        `.env.secret${environment ? `.${environment}` : ''}`,
        Object.keys(secrets)
            .map((key) => `${key}=${secrets[key]}`)
            .join('\n'),
        () => {}
    );
}

async function getEnvWithConnect(
    name: string,
    vault: string,
    environment?: string
) {
    // Create new connector with HTTP Pooling
    const op = OnePasswordConnect({
        serverURL: 'http://localhost:8080',
        token: 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjJkZ3NjYnAydmkzcWo3dGtjbG12NWY0cDU0IiwidHlwIjoiSldUIn0.eyIxcGFzc3dvcmQuY29tL2F1dWlkIjoiUllIQzRLTlZEQkVZQlBWT0VTV09OMldETk0iLCIxcGFzc3dvcmQuY29tL3Rva2VuIjoiQkkyRHc3YTY4OUZqRE9Ya0RNZEVuT3RMNkh3MEprWmMiLCIxcGFzc3dvcmQuY29tL2Z0cyI6WyJ2YXVsdGFjY2VzcyJdLCIxcGFzc3dvcmQuY29tL3Z0cyI6W3sidSI6ImtsYzRyZXRieHZ2Z2pmM2NqNHkyenNvcm1xIiwiYSI6NDh9XSwiYXVkIjpbImNvbS4xcGFzc3dvcmQuY29ubmVjdCJdLCJzdWIiOiJaSTVNWlNYTlo1RUdSR0VFWTVISEkzRTNKQSIsImlhdCI6MTY3NDQ3Njk2NiwiaXNzIjoiY29tLjFwYXNzd29yZC5iNSIsImp0aSI6Im1rYWgyd3kyN3hjNXk1dmJjeHVtMnU1Z2E0In0.1P_bgm1e94o0fgYCEBkuIkIi5LsBVuyc7BSh-0OFr_yasNuvPV6BT9_vuqD6YTVO6pPhh_eQSbhpCwft099SVg',
        keepAlive: true,
    });

    const vaults = await op.getVault(vault);
    if (!vaults) throw new Error('Vault not found');
    const itemForOp = await op.getItemByTitle(vaults.id!, name);
    const { values } = (itemForOp.fields || []).reduce<{
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

    // Create .env<.environment> file with all plain values
    fs.writeFile(
        `.env${environment ? `.${environment}` : ''}`,
        Object.keys(values)
            .map((key) => `${key}=${values[key]}`)
            .join('\n'),
        () => {}
    );
}

export default async function getEnvFrom1Password(
    name: string,
    vault: string,
    environment?: string,
    connect?: boolean
): Promise<void> {
    if (connect) {
        getEnvWithConnect(name, vault, environment);
    } else {
        getEnvWithCli(name, vault, environment);
    }
}
