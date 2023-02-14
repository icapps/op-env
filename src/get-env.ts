import { exec } from 'child_process';
import fs from 'fs';

export type OpItem = {
    id: string;
    title: string;
    version: number;
    vault: Vault;
    category: string;
    last_edited_by: string;
    created_at: Date;
    updated_at: Date;
    sections: Section[];
    fields: Field[];
};

export type Field = {
    id: string;
    type: string;
    purpose?: string;
    label: string;
    reference: string;
    section?: Section;
    value?: string;
};

export type Section = {
    id: string;
};

export type Vault = {
    id: string;
    name: string;
};

// first two args are node and the script name
const [itemNameOrId, environment] = process.argv.slice(2);

exec(`op item get ${itemNameOrId} --format json`, (err, stdout, stderr) => {
    if (err) console.log(`err`, err);
    if (stderr) console.log(`stderr`, stderr);

    const fullItem: OpItem = JSON.parse(stdout);

    const valueFile = fullItem.fields
        .filter((field) => !field.purpose)
        .map((field) => `${field.label}=${field.value}`);
    const secretFile = fullItem.fields
        .filter((field) => !field.purpose)
        .map((field) => `${field.label}=${field.reference}`);

    fs.writeFile(
        `.env${environment ? `.${environment}` : ''}`,
        valueFile.join('\n'),
        () => {}
    );
    fs.writeFile(
        `.env.secret${environment ? `.${environment}` : ''}`,
        secretFile.join('\n'),
        () => {}
    );
});
