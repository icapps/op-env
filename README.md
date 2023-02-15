# OP-ENV

op-env is a project that uses the 1password cli (op) to convert a secure note in a 1password vault to a local .env file with plain text secrets (for development purposes) and a .env.secrets file with references to 1password entries which you can use in ci.

## Contents

-   [nodemon](https://www.npmjs.com/package/nodemon)
-   [ESLint](https://www.npmjs.com/package/eslint) with [Airbnb's ESLint config](https://www.npmjs.com/package/eslint-config-airbnb-base)
-   [Prettier](https://www.npmjs.com/package/prettier)
-   [lint-staged](https://www.npmjs.com/package/lint-staged)
-   [GitHub Actions](https://github.com/features/actions)

## Usage

Get
op-env get -- -n <name> -e <environment>
-n, --name <name> Name of the item
-e, --environment <environment> Environment to create the item in

Set
op-env set -- -v <vault> -f <filename> -t <title>
-v, --vault <vault> Vault to create the item in
-f, --env-file <envFile> Path to the env file
-t, --title <title> Title of the item

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
