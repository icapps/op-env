import fs from 'fs';
import { item, FieldAssignment } from '@1password/op-js';
import { OnePasswordConnect, FullItem } from '@1password/connect';
import { FullItemAllOfFields } from '@1password/connect/dist/model/fullItemAllOfFields';
import config from '../src/config';

async function createItemWithConnect(
    envFile: string,
    vault: string,
    title: string
): Promise<void> {
    // Create new connector with HTTP Pooling
    const op = OnePasswordConnect({
        serverURL: config.CONNECT_URL,
        token: config.CONNECT_TOKEN,
        keepAlive: true,
    });
    const opVault = await op.getVault(vault);
    if (!opVault) throw new Error('Vault not found');

    try {
        fs.readFile(envFile, 'utf8', async (err, data) => {
            if (err) {
                console.error('err', err);
                process.exit(1);
            }

            const fields = data
                .split(/\r?\n/)
                .filter((line) => !!line)
                .map((line) => ({
                    label: line.split('=')[0],
                    value: line.split('=')[1],
                    type: 'concealed',
                })) as unknown as FullItemAllOfFields[];

            let existingItem;
            if (title) {
                existingItem = await op.getItemByTitle(opVault.id!, title);
            }
            if (existingItem) {
                await op.updateItem(opVault.id!, {
                    ...existingItem,
                    fields,
                } as unknown as FullItem);
            } else {
                await op.createItem(opVault.id!, {
                    title,
                    category: 'Secure Note',
                    fields,
                } as unknown as FullItem);
            }
        });
    } catch (error) {
        console.error('error', error);
    }
}

function createItemWithCli(
    envFile: string,
    vault: string,
    title: string
): void {
    try {
        fs.readFile(envFile, 'utf8', async (err, data) => {
            if (err) {
                console.error('err', err);
                process.exit(1);
            }

            const fields: FieldAssignment[] = data
                .split(/\r?\n/)
                .filter((line) => !!line)
                .map((line) => [
                    line.split('=')[0],
                    'concealed',
                    line.split('=')[1],
                ]);
            const existingItem = item.get(title, { vault });
            if (existingItem) {
                item.edit(existingItem.title, fields);
            } else {
                item.create(fields, { vault, title, category: 'Secure Note' });
            }
        });
    } catch (error) {
        console.error('error', error);
    }
}

export default async function createItemFromFile(
    envFile: string,
    vault: string,
    title: string,
    name: string,
    connect: boolean
): Promise<void> {
    if (connect) await createItemWithConnect(envFile, vault, title);
    else createItemWithCli(envFile, vault, title);
}
