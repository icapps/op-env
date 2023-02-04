import * as dotenv from 'dotenv-safe';
import { cleanEnv, str } from 'envalid';

dotenv.config({
    allowEmptyValues: true,
});

export default cleanEnv(process.env, {
    NODE_ENV: str({
        default: 'development',
        choices: ['development', 'production'],
    }),
});
