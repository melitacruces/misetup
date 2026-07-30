const fs = require('node:fs/promises');
const path = require('node:path');
const { Client, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

function connectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

async function run() {
  if (process.env.MISETUP_MODE !== 'database') {
    throw new Error(
      'db:setup solo puede ejecutarse con MISETUP_MODE=database para proteger la preview pública.'
    );
  }

  const databaseUrl = connectionString();
  if (!databaseUrl) {
    throw new Error('Falta DATABASE_URL o una variable POSTGRES_URL compatible.');
  }

  const schemaPath = path.join(__dirname, 'db_schema.sql');
  const schema = await fs.readFile(schemaPath, 'utf8');
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query(schema);
    console.log('Base de datos MiSetup inicializada correctamente.');
  } finally {
    await client.end();
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
