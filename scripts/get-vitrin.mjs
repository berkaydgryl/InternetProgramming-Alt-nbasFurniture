import postgres from 'postgres';
const sql = postgres('postgresql://postgres.aabegezcetaigzuqilfx:Ye%C5%9Filova123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres');
const rows = await sql`SELECT homepage_categories FROM catalog WHERE id = 1`;
console.log(JSON.stringify(rows[0]?.homepage_categories, null, 2));
await sql.end();
