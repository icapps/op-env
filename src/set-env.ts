import fs from 'fs';
import { item, FieldAssignment } from '@1password/op-js';
import { OnePasswordConnect, FullItem } from '@1password/connect';
import { FullItemAllOfFields } from '@1password/connect/dist/model/fullItemAllOfFields';

async function createItemWithConnect(
    envFile: string,
    vault: string,
    title: string,
    name: string
): Promise<void> {
    // Create new connector with HTTP Pooling
    const op = OnePasswordConnect({
        serverURL: 'http://localhost:8080',
        token: 'test',
        keepAlive: true,
    });
    const opVault = await op.getVault(vault);
    if (!opVault) throw new Error('Vault not found');
    console.log('opVault', opVault);

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
            console.log('fields', fields);

            let existingItem;
            if (name) {
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

            // const fields: FieldAssignment[] = data
            //     .split(/\r?\n/)
            //     .filter((line) => !!line)
            //     .map((line) => [
            //         line.split('=')[0],
            //         'concealed',
            //         line.split('=')[1],
            //     ]);

            // item.create(fields, { vault, title, category: 'Secure Note' });
        });
    } catch (error) {
        console.log('error', error);
    }
}

function createItemWithCli(
    envFile: string,
    vault: string,
    title: string,
    name: string
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
            const existingItem = item.get(name, { vault });
            if (existingItem) {
                item.edit(existingItem.title, fields);
            } else {
                item.create(fields, { vault, title, category: 'Secure Note' });
            }
        });
    } catch (error) {
        console.log('error', error);
    }
}

export default async function createItemFromFile(
    envFile: string,
    vault: string,
    title: string,
    name: string
): Promise<void> {
    createItemWithCli(envFile, vault, title, name);
    await createItemWithConnect(envFile, vault, title, name);
}
