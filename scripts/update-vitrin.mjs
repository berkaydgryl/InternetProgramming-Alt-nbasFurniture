import postgres from 'postgres';
const sql = postgres('postgresql://postgres.aabegezcetaigzuqilfx:Ye%C5%9Filova123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres');

const pexelsImg = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

// Category -> Pexels photo mapping
const imageMap = {
  "Custom Design Tables": pexelsImg(298842),       // elegant coffee table with sofa
  "Classic & Modern Bergères": pexelsImg(1648776),  // luxury sofa chairs in living room
  "Luxury Dressers": pexelsImg(8135502),            // bright luxury bedroom interior
  "Decorative Mirrors": pexelsImg(3489131),         // elegant mirror on wall
};

try {
  const rows = await sql`SELECT homepage_categories FROM catalog WHERE id = 1`;
  const categories = rows[0]?.homepage_categories || [];

  const updated = categories.map((cat) => ({
    ...cat,
    image: imageMap[cat.name] || cat.image,
  }));

  await sql`
    UPDATE catalog
    SET homepage_categories = ${JSON.stringify(updated)}::jsonb,
        updated_at = NOW()
    WHERE id = 1
  `;

  console.log("Showcase images updated:");
  updated.forEach((c) => {
    console.log(`  [${c.id}] ${c.name} -> ${c.image ? "OK" : "MISSING"}`);
  });
} catch (e) {
  console.error("Error:", e);
}
await sql.end();
