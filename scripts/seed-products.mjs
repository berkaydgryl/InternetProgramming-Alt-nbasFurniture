import postgres from 'postgres';

const sql = postgres('postgresql://postgres.aabegezcetaigzuqilfx:Ye%C5%9Filova123@aws-0-eu-west-1.pooler.supabase.com:6543/postgres');

const pexelsImg = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

const prototypeProducts = [
  // ─── Classic & Modern Bergères ───
  {
    category: "Classic & Modern Bergères",
    name: "Royal Chester Bergère",
    description: "Velvet fabric upholstery, hand-carved walnut legs. Seat height: 45cm.",
    images: [pexelsImg(2079249), pexelsImg(5997975)],
    isActive: true, isFeatured: false,
  },
  {
    category: "Classic & Modern Bergères",
    name: "Milano Modern Bergère",
    description: "Italian design, fabric options in pastel tones. 75x80x95cm.",
    images: [pexelsImg(6758342), pexelsImg(6758281)],
    isActive: true, isFeatured: false,
  },
  {
    category: "Classic & Modern Bergères",
    name: "Venice Wing Bergère",
    description: "Classic wing bergère model, gold leaf details. Seat: 50x55cm.",
    images: [pexelsImg(30790460)],
    isActive: true, isFeatured: true,
  },

  // ─── Custom Design Tables ───
  {
    category: "Custom Design Tables",
    name: "Elara Marble Coffee Table",
    description: "Natural marble top, brass legs. 120x60x45cm.",
    images: [pexelsImg(279607), pexelsImg(7018406)],
    isActive: true, isFeatured: false,
  },
  {
    category: "Custom Design Tables",
    name: "Nesta Nesting Table Set",
    description: "Set of 3 nesting tables, matte black metal frame, walnut veneer. Largest: 50x50x55cm.",
    images: [pexelsImg(7546213)],
    isActive: true, isFeatured: false,
  },
  {
    category: "Custom Design Tables",
    name: "Luna Glass Coffee Table",
    description: "Tempered glass top, chrome leg details. 110x60x40cm.",
    images: [pexelsImg(1457842), pexelsImg(1669799)],
    isActive: true, isFeatured: true,
  },

  // ─── Luxury Dressers ───
  {
    category: "Luxury Dressers",
    name: "Sapphire Blue Lacquer Dresser",
    description: "Custom lacquer paint, brass handle details. 140x45x85cm. 6 drawers.",
    images: [pexelsImg(31737843), pexelsImg(20439293)],
    isActive: true, isFeatured: true,
  },
  {
    category: "Luxury Dressers",
    name: "Elegance Console Dresser",
    description: "Glossy white lacquer, gold trim detail. 120x40x80cm. Mirrored top compartment.",
    images: [pexelsImg(6527066)],
    isActive: true, isFeatured: false,
  },
  {
    category: "Luxury Dressers",
    name: "Noir Bedroom Chest",
    description: "Matte black finish, soft-close drawers. 90x50x120cm. 5 drawers.",
    images: [pexelsImg(7614416), pexelsImg(33837741)],
    isActive: true, isFeatured: false,
  },

  // ─── Decorative Mirrors ───
  {
    category: "Decorative Mirrors",
    name: "Versailles Gold-Framed Mirror",
    description: "Hand-crafted gold leaf frame, antique patina finish. 80x120cm.",
    images: [pexelsImg(18177370), pexelsImg(8692912)],
    isActive: true, isFeatured: true,
  },
  {
    category: "Decorative Mirrors",
    name: "Minimal Round Wall Mirror",
    description: "Matte black metal frame, 80cm diameter. Ideal for hallways and living rooms.",
    images: [pexelsImg(905198)],
    isActive: true, isFeatured: false,
  },
  {
    category: "Decorative Mirrors",
    name: "Botanic Console Mirror",
    description: "Natural wood frame, rectangular form. 60x90cm. Wall mount included.",
    images: [pexelsImg(2203743), pexelsImg(6186516)],
    isActive: true, isFeatured: false,
  },
];

async function seed() {
  try {
    // Fetch existing data
    const rows = await sql`SELECT products FROM catalog WHERE id = 1`;
    const existingProducts = rows[0]?.products || [];

    // Start new IDs after the current highest ID
    let maxId = existingProducts.reduce((max, p) => Math.max(max, p.id || 0), 0);

    const newProducts = prototypeProducts.map((p) => ({
      ...p,
      id: ++maxId,
    }));

    const allProducts = [...existingProducts, ...newProducts];

    // Update the database
    await sql`
      UPDATE catalog
      SET products = ${JSON.stringify(allProducts)}::jsonb,
          updated_at = NOW()
      WHERE id = 1
    `;

    console.log(`✓ ${newProducts.length} prototype products added.`);
    console.log(`  Total product count: ${allProducts.length}`);
    console.log(`\nProducts added:`);
    newProducts.forEach((p) => {
      console.log(`  [${p.id}] ${p.name} — ${p.category} (${p.images.length} images)`);
    });
  } catch (e) {
    console.error("Error:", e);
  }
  await sql.end();
}

seed();
