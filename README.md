# op-env

op-env is a project that uses the 1password cli (op) to convert a secure note in a 1password vault to a local .env file with plain text secrets (for development purposes) and a .env.secrets file with references to 1password entries which you can use in ci.

## Contents

-   [nodemon](https://www.npmjs.com/package/nodemon)
-   [ESLint](https://www.npmjs.com/package/eslint) with [Airbnb's ESLint config](https://www.npmjs.com/package/eslint-config-airbnb-base)
-   [Prettier](https://www.npmjs.com/package/prettier)
-   [lint-staged](https://www.npmjs.com/package/lint-staged)
-   [GitHub Actions](https://github.com/features/actions)

## Usage cli

op-env

```bash
Usage: op-env [options] [command]

Options:
  -h, --help      display help for command

Commands:
  get [options]
  set [options]
  help [command]  display help for command
```

get

```bash
Usage: op-env set [options]

Options:
  -v, --vault <vault>       Vault to create the item in
  -f, --env-file <envFile>  Path to the env file
  -t, --title <title>       Title of the item
  -h, --help                display help for command
```

set

```bash
Usage: op-env get [options]

Options:
  -n, --name <name>                Name of the item
  -e, --environment <environment>  Environment to create the item in this will result in .env.<environment> and .env.secrets.<environment>
  -h, --help
```

## Usage npm

When trying to run the commands using npm run you will have to pass the params for example:

```bash
npm run op-env -- -n name -e dev
```

### Development

```bash
# Run in development mode
npm run dev
```

### Production

```bash
# Create a production build
npm run build

# Run the production build
npm run start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[ISC](LICENSE.md)
