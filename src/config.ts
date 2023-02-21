import * as dotenv from 'dotenv-safe';
import { cleanEnv, str } from 'envalid';

dotenv.config({
    allowEmptyValues: true,
});

export default cleanEnv(process.env, {
    CONNECT_URL: str(),
    CONNECT_TOKEN: str(),
});
