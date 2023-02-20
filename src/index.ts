#!/usr/bin/env node
import { validateCli } from '@1password/op-js';
import { program } from 'commander';
import getEnvFrom1Password from '../scripts/get-env';
import createItemFromFile from '../scripts/set-env';

validateCli().catch((error) => {
    console.error('CLI is not valid:', error.message);
    process.exit(1);
});

program
    .command('get')
    .option('-v, --vault <vault>', 'Vault that contains the item')
    .option('-n, --name <name>', 'Name of the item')
    .option(
        '-f, --format <format>',
        'Format of the output files (possible values: "env" | "dart")'
    )
    .option('-l, --location <location>', 'Location of the output files')
    .option(
        '-e, --environment <environment>',
        'Environment to create the item in'
    )
    .action(({ vault, name, format, location, environment }) =>
        getEnvFrom1Password(vault, name, format, location, environment)
    );

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
