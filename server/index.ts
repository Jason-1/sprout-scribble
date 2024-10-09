import 'dotenv/config';
import { drizzle } from 'drizzle-orm/connect';

async function main() {
    const db = await drizzle("node-postgres", process.env.POSTGRES_URL as string);
}

main();