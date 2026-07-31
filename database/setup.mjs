import { fileURLToPath } from 'node:url';
import postgres from 'postgres';

if (process.env.MISETUP_MODE === 'preview') {
  throw new Error('No se puede inicializar una base de datos en modo preview.');
}

if (!process.env.DATABASE_URL) {
  throw new Error('Falta DATABASE_URL en .env.local.');
}

const isLocalConnection = /localhost|127\.0\.0\.1/.test(
  process.env.DATABASE_URL
);
const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  ssl:
    process.env.POSTGRES_SSL === 'disable' || isLocalConnection
      ? false
      : 'require',
});
const schemaPath = fileURLToPath(new URL('./schema.sql', import.meta.url));

try {
  await sql.file(schemaPath);
  console.log('Base de datos MiSetup inicializada correctamente.');
} finally {
  await sql.end({ timeout: 5 });
}
