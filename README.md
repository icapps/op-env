# typescript-starter

typescript-starter is starter template to quickly get started with TypeScript 🏎️

## Contents

-   [nodemon](https://www.npmjs.com/package/nodemon)
-   [ESLint](https://www.npmjs.com/package/eslint) with [Airbnb's ESLint config](https://www.npmjs.com/package/eslint-config-airbnb-base)
-   [Prettier](https://www.npmjs.com/package/prettier)
-   [lint-staged](https://www.npmjs.com/package/lint-staged)
-   [Jest](https://www.npmjs.com/package/jest)
-   [Docker](https://www.docker.com)
-   [GitHub Actions](https://github.com/features/actions)
-   [Bitbucket Pipelines](https://bitbucket.org/product/features/pipelines)
    -   Make sure to set the `BITBUCKET_USERNAME` and `BITBUCKET_APP_PASSWORD` repository variables.<br>The [app password](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords) should have the `Pipelines Write` and `Repositories Read` permissions.

## Usage

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
