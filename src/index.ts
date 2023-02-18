#!/usr/bin/env node
import { validateCli } from '@1password/op-js';
import { program } from 'commander';
import getEnvFrom1Password from './get-env';
import createItemFromFile from './set-env';

validateCli().catch((error) => {
    // TODO: Stop execution of command
    console.error('CLI is not valid:', error.message);
    process.exit(1);
});

program
    .command('get')
    .option('-n, --name <name>', 'Name of the item')
    .option('-v, --vault <vault>', 'Vault to create the item in')
    .option(
        '-e, --environment <environment>',
        'Environment to create the item in'
    )
    .option('-c, --connect <connect>', 'use connect server')
    .action(({ name, environment, vault, connect }) =>
        getEnvFrom1Password(name, vault, environment, connect)
    );

program
    .command('set')
    .option('-v, --vault <vault>', 'Vault to create the item in')
    .option('-f, --env-file <envFile>', 'Path to the env file')
    .option('-t, --title <title>', 'Title of the item')
    .option('-n, --name <name>', 'Name of the item')
    .option('-c, --connect <connect>', 'use connect server')
    .action(({ vault, envFile, title, name }) =>
        createItemFromFile(envFile, vault, title, name)
    );

program.parse(process.argv);

export default program;
