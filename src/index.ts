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
    .option(
        '-e, --environment <environment>',
        'Environment to create the item in'
    )
    .action(({ name, environment }) => getEnvFrom1Password(name, environment));

program
    .command('set')
    .option('-v, --vault <vault>', 'Vault to create the item in')
    .option('-f, --env-file <envFile>', 'Path to the env file')
    .option('-t, --title <title>', 'Title of the item')
    .action(({ vault, envFile, title }) =>
        createItemFromFile(envFile, vault, title)
    );

program.parse(process.argv);

export default program;
