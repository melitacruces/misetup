require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function run() {
  try {
    await sql`UPDATE equipment SET category = 'core' WHERE category = 'base'`;
    await sql`UPDATE equipment SET category = 'desk' WHERE category = 'io'`;
    await sql`UPDATE equipment SET category = 'studio' WHERE category = 'audio'`;
    console.log('Migration done');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit();
  }
}
run();
