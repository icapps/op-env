# typescript-starter

typescript-starter is starter template to quickly get started with TypeScript 🏎️

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

#### Docker

```bash
# Create a Docker image
docker build -t typescript-starter .
# Start up a Docker container
docker run --name typescript-starter -it typescript-starter

# Or just use Docker Compose
docker compose up
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[ISC](LICENSE.md)
