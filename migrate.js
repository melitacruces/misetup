const { neon } = require('@neondatabase/serverless');

async function run() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    throw new Error('Falta DATABASE_URL o una variable POSTGRES_URL compatible.');
  }

  const sql = neon(connectionString);
  await sql.transaction([
    sql`UPDATE equipment SET category = 'core' WHERE category = 'base'`,
    sql`UPDATE equipment SET category = 'desk' WHERE category = 'io'`,
    sql`UPDATE equipment SET category = 'studio' WHERE category = 'audio'`,
  ]);
  console.log('Migration done');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
