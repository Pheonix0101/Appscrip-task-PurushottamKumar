import "dotenv/config";
import { supabase } from "./client";

type SeedProduct = {
  slug: string;
  title: string;
  description: string;
  price: string;
  category: string;
  popularity: number;
  customizable?: boolean;
  attributes: Record<string, string[]>;
  images: { file: string; alt: string }[];
};

const categoryNames: Record<string, string> = {
  bags: "Bags",
  accessories: "Accessories",
  toys: "Toys",
  headwear: "Headwear",
  home: "Home",
};

const catalog: SeedProduct[] = [
  {
    slug: "black-woven-roll-top-backpack", title: "Black Woven Roll-Top Backpack",
    description: "A roomy charcoal woven backpack with a roll-top closure and adjustable straps.",
    price: "129.00", category: "bags", popularity: 95, customizable: true,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Casual", "Everyday"], work: ["Handwoven"], fabric: ["Recycled Fiber"], segment: ["Bags"], suitableFor: ["Travel", "Casual Wear"], rawMaterials: ["Recycled Fiber"], pattern: ["Woven"] },
    images: [
      { file: "black-woven-roll-top-backpack-front.png", alt: "Front view of a black woven roll-top backpack" },
      { file: "black-woven-roll-top-backpack-back.png", alt: "Back straps of the black woven roll-top backpack" },
      { file: "black-woven-roll-top-backpack-side.png", alt: "Side view of the black woven roll-top backpack" },
      { file: "black-woven-roll-top-backpack-detail.png", alt: "Detail of the black woven roll-top backpack" },
    ],
  },
  {
    slug: "yellow-crochet-dinosaur-toy", title: "Yellow Crochet Dinosaur Toy",
    description: "A soft yellow crochet dinosaur with bright blue details, made for little hands.",
    price: "39.00", category: "toys", popularity: 88,
    attributes: { idealFor: ["Baby & Kids"], occasion: ["Party", "Everyday"], work: ["Crochet"], fabric: ["Cotton"], segment: ["Toys"], suitableFor: ["Gifts"], rawMaterials: ["Cotton"], pattern: ["Solid"] },
    images: [
      { file: "yellow-crochet-dinosaur-front.png", alt: "Yellow crochet dinosaur toy facing forward" },
      { file: "yellow-crochet-dinosaur-side.png", alt: "Side view of the yellow crochet dinosaur toy" },
      { file: "yellow-crochet-dinosaur-detail.png", alt: "Detail of the yellow crochet dinosaur toy" },
    ],
  },
  {
    slug: "tan-leather-key-tag", title: "Tan Leather Key Tag",
    description: "A tan leather key tag with a clear label pocket and sturdy metal clasp.",
    price: "24.00", category: "accessories", popularity: 84, customizable: true,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Everyday"], work: ["Leathercraft"], fabric: ["Leather"], segment: ["Accessories"], suitableFor: ["Travel", "Gifts"], rawMaterials: ["Leather"], pattern: ["Solid"] },
    images: [{ file: "leather-key-tag.png", alt: "Tan leather key tag with a clear label pocket" }],
  },
  {
    slug: "embroidered-linen-cap", title: "Embroidered Linen Cap",
    description: "A light linen cap with delicate botanical embroidery on the side.",
    price: "48.00", category: "headwear", popularity: 78,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Casual", "Everyday"], work: ["Embroidery"], fabric: ["Linen"], segment: ["Headwear"], suitableFor: ["Casual Wear", "Travel"], rawMaterials: ["Linen"], pattern: ["Embroidered"] },
    images: [{ file: "embroidered-linen-cap.png", alt: "Light linen cap with botanical embroidery" }],
  },
  {
    slug: "tan-woven-leather-sling", title: "Tan Woven Leather Sling",
    description: "A compact tan leather sling with a woven body and adjustable strap.",
    price: "112.00", category: "bags", popularity: 74,
    attributes: { idealFor: ["Women"], occasion: ["Casual", "Party"], work: ["Leathercraft"], fabric: ["Leather"], segment: ["Bags"], suitableFor: ["Casual Wear", "Travel"], rawMaterials: ["Leather"], pattern: ["Woven"] },
    images: [{ file: "woven-leather-sling.png", alt: "Side view of a tan woven leather sling bag" }],
  },
  {
    slug: "striped-cotton-coin-pouch", title: "Striped Cotton Coin Pouch",
    description: "A small zippered pouch in woven black and white cotton stripes.",
    price: "28.00", category: "accessories", popularity: 72,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Everyday"], work: ["Handwoven"], fabric: ["Cotton"], segment: ["Accessories"], suitableFor: ["Travel", "Gifts"], rawMaterials: ["Cotton"], pattern: ["Striped"] },
    images: [{ file: "striped-coin-pouch.png", alt: "Black and white striped cotton coin pouch" }],
  },
  {
    slug: "recycled-weave-pouch", title: "Recycled Weave Pouch",
    description: "A colorful zippered pouch woven from recycled fibers.",
    price: "32.00", category: "accessories", popularity: 69,
    attributes: { idealFor: ["Women"], occasion: ["Everyday"], work: ["Handwoven"], fabric: ["Recycled Fiber"], segment: ["Accessories"], suitableFor: ["Travel", "Gifts"], rawMaterials: ["Recycled Fiber"], pattern: ["Striped"] },
    images: [{ file: "recycled-weave-pouch.png", alt: "Colorful pouch woven from recycled fibers" }],
  },
  {
    slug: "basketweave-shoulder-bag", title: "Basketweave Shoulder Bag",
    description: "A warm tan shoulder bag with a basketweave pattern and long strap.",
    price: "145.00", category: "bags", popularity: 66,
    attributes: { idealFor: ["Women"], occasion: ["Casual", "Party"], work: ["Leathercraft"], fabric: ["Leather"], segment: ["Bags"], suitableFor: ["Casual Wear", "Travel"], rawMaterials: ["Leather"], pattern: ["Woven"] },
    images: [{ file: "basketweave-shoulder-bag.png", alt: "Tan basketweave shoulder bag with a long strap" }],
  },
  {
    slug: "handwoven-jute-tote", title: "Handwoven Jute Tote",
    description: "An everyday jute tote with room for market finds and daily essentials.",
    price: "72.00", category: "bags", popularity: 40, customizable: true,
    attributes: { idealFor: ["Women"], occasion: ["Casual", "Everyday"], work: ["Handwoven"], fabric: ["Jute"], segment: ["Bags"], suitableFor: ["Casual Wear", "Travel"], rawMaterials: ["Jute"], pattern: ["Woven"] }, images: [],
  },
  {
    slug: "crochet-bunny-toy", title: "Crochet Bunny Toy",
    description: "A soft handmade bunny for playtime and gifts.",
    price: "35.00", category: "toys", popularity: 35,
    attributes: { idealFor: ["Baby & Kids"], occasion: ["Party", "Everyday"], work: ["Crochet"], fabric: ["Cotton"], segment: ["Toys"], suitableFor: ["Gifts"], rawMaterials: ["Cotton"], pattern: ["Solid"] }, images: [],
  },
  {
    slug: "block-print-cotton-scarf", title: "Block-Print Cotton Scarf",
    description: "A lightweight cotton scarf finished with a hand-printed motif.",
    price: "44.00", category: "accessories", popularity: 30,
    attributes: { idealFor: ["Women"], occasion: ["Casual", "Party"], work: ["Handwoven"], fabric: ["Cotton"], segment: ["Accessories"], suitableFor: ["Casual Wear", "Gifts"], rawMaterials: ["Cotton"], pattern: ["Printed"] }, images: [],
  },
  {
    slug: "kantha-cushion-cover", title: "Kantha Cushion Cover",
    description: "A stitched cotton cushion cover for a warm and layered home.",
    price: "68.00", category: "home", popularity: 25, customizable: true,
    attributes: { idealFor: ["Women", "Men"], occasion: ["Everyday"], work: ["Embroidery"], fabric: ["Cotton"], segment: ["Home"], suitableFor: ["Home", "Gifts"], rawMaterials: ["Cotton"], pattern: ["Embroidered"] }, images: [],
  },
  {
    slug: "indigo-block-print-cotton-scarf", title: "Indigo Block-Print Cotton Scarf",
    description: "A soft indigo cotton scarf with a delicate white botanical print.",
    price: "52.00", category: "accessories", popularity: 65,
    attributes: { idealFor: ["Women"], occasion: ["Casual", "Everyday"], work: ["Handwoven"], fabric: ["Cotton"], segment: ["Accessories"], suitableFor: ["Casual Wear", "Gifts"], rawMaterials: ["Cotton"], pattern: ["Printed"] },
    images: [{ file: "indigo-block-print-cotton-scarf.jpg", alt: "Indigo cotton scarf with a white botanical block print" }],
  },
  {
    slug: "sage-handwoven-market-tote", title: "Sage Handwoven Market Tote",
    description: "A roomy sage green cotton tote with sturdy handles and a textured weave.",
    price: "78.00", category: "bags", popularity: 63, customizable: true,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Casual", "Everyday"], work: ["Handwoven"], fabric: ["Cotton"], segment: ["Bags"], suitableFor: ["Travel", "Casual Wear"], rawMaterials: ["Cotton"], pattern: ["Woven"] },
    images: [{ file: "sage-handwoven-market-tote.jpg", alt: "Sage green handwoven cotton market tote" }],
  },
  {
    slug: "rust-crochet-fox-toy", title: "Rust Crochet Fox Toy",
    description: "A cuddly rust-colored crochet fox with a cream face and belly.",
    price: "42.00", category: "toys", popularity: 61,
    attributes: { idealFor: ["Baby & Kids"], occasion: ["Party", "Everyday"], work: ["Crochet"], fabric: ["Cotton"], segment: ["Toys"], suitableFor: ["Gifts"], rawMaterials: ["Cotton"], pattern: ["Solid"] },
    images: [{ file: "rust-crochet-fox-toy.jpg", alt: "Rust and cream handmade crochet fox toy" }],
  },
  {
    slug: "mustard-linen-bucket-hat", title: "Mustard Linen Bucket Hat",
    description: "A lightweight mustard linen bucket hat with a softly stitched brim.",
    price: "46.00", category: "headwear", popularity: 59,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Casual", "Everyday"], work: [], fabric: ["Linen"], segment: ["Headwear"], suitableFor: ["Casual Wear", "Travel"], rawMaterials: ["Linen"], pattern: ["Solid"] },
    images: [{ file: "mustard-linen-bucket-hat.jpg", alt: "Mustard yellow linen bucket hat" }],
  },
  {
    slug: "tan-leather-card-sleeve", title: "Tan Leather Card Sleeve",
    description: "A slim tan leather sleeve with three card slots and neat edge stitching.",
    price: "36.00", category: "accessories", popularity: 57, customizable: true,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Everyday"], work: ["Leathercraft"], fabric: ["Leather"], segment: ["Accessories"], suitableFor: ["Travel", "Gifts"], rawMaterials: ["Leather"], pattern: ["Solid"] },
    images: [{ file: "tan-leather-card-sleeve.jpg", alt: "Tan leather card sleeve with stitched edges" }],
  },
  {
    slug: "terracotta-embroidered-cushion-cover", title: "Terracotta Embroidered Cushion Cover",
    description: "A warm terracotta cotton cushion cover with cream botanical embroidery.",
    price: "74.00", category: "home", popularity: 55,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Everyday"], work: ["Embroidery"], fabric: ["Cotton"], segment: ["Home"], suitableFor: ["Home", "Gifts"], rawMaterials: ["Cotton"], pattern: ["Embroidered"] },
    images: [{ file: "terracotta-embroidered-cushion-cover.jpg", alt: "Terracotta cushion cover with cream botanical embroidery" }],
  },
  {
    slug: "natural-jute-table-runner", title: "Natural Jute Table Runner",
    description: "A textured natural jute table runner finished with soft fringe.",
    price: "64.00", category: "home", popularity: 53,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Everyday"], work: ["Handwoven"], fabric: ["Jute"], segment: ["Home"], suitableFor: ["Home", "Gifts"], rawMaterials: ["Jute"], pattern: ["Woven"] },
    images: [{ file: "natural-jute-table-runner.jpg", alt: "Natural handwoven jute table runner with fringe" }],
  },
  {
    slug: "cream-macrame-wall-hanging", title: "Cream Macrame Wall Hanging",
    description: "A small cream cotton wall hanging with hand-knotted texture and fringe.",
    price: "58.00", category: "home", popularity: 51,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Everyday"], work: ["Handwoven"], fabric: ["Cotton"], segment: ["Home"], suitableFor: ["Home", "Gifts"], rawMaterials: ["Cotton"], pattern: ["Woven"] },
    images: [{ file: "cream-macrame-wall-hanging.jpg", alt: "Cream cotton macrame wall hanging on a wooden dowel" }],
  },
  {
    slug: "navy-recycled-weave-weekender-bag", title: "Navy Recycled Weave Weekender Bag",
    description: "A roomy navy woven weekender with sturdy handles and a zippered top.",
    price: "158.00", category: "bags", popularity: 80, customizable: true,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Casual", "Everyday"], work: ["Handwoven"], fabric: ["Recycled Fiber"], segment: ["Bags"], suitableFor: ["Travel"], rawMaterials: ["Recycled Fiber"], pattern: ["Woven"] },
    images: [{ file: "navy-recycled-weave-weekender-bag.jpg", alt: "Navy woven weekender bag with handles and zipper" }],
  },
  {
    slug: "caramel-jute-crossbody-bag", title: "Caramel Jute Crossbody Bag",
    description: "A compact caramel jute bag with a woven strap and simple flap.",
    price: "86.00", category: "bags", popularity: 67,
    attributes: { idealFor: ["Women"], occasion: ["Casual", "Everyday"], work: ["Handwoven"], fabric: ["Jute"], segment: ["Bags"], suitableFor: ["Travel", "Casual Wear"], rawMaterials: ["Jute"], pattern: ["Woven"] },
    images: [{ file: "caramel-jute-crossbody-bag.jpg", alt: "Caramel handwoven jute crossbody bag" }],
  },
  {
    slug: "coral-crochet-octopus-toy", title: "Coral Crochet Octopus Toy",
    description: "A cheerful coral crochet octopus with curled tentacles and a stitched smile.",
    price: "37.00", category: "toys", popularity: 73,
    attributes: { idealFor: ["Baby & Kids"], occasion: ["Party", "Everyday"], work: ["Crochet"], fabric: ["Cotton"], segment: ["Toys"], suitableFor: ["Gifts"], rawMaterials: ["Cotton"], pattern: ["Solid"] },
    images: [{ file: "coral-crochet-octopus-toy.jpg", alt: "Coral pink crochet octopus toy with curled tentacles" }],
  },
  {
    slug: "cream-crochet-bear-toy", title: "Cream Crochet Bear Toy",
    description: "A soft cream crochet bear with round ears and a friendly stitched face.",
    price: "41.00", category: "toys", popularity: 49,
    attributes: { idealFor: ["Baby & Kids"], occasion: ["Party", "Everyday"], work: ["Crochet"], fabric: ["Cotton"], segment: ["Toys"], suitableFor: ["Gifts"], rawMaterials: ["Cotton"], pattern: ["Solid"] },
    images: [{ file: "cream-crochet-bear-toy.jpg", alt: "Cream handmade crochet teddy bear toy" }],
  },
  {
    slug: "olive-embroidered-cotton-cap", title: "Olive Embroidered Cotton Cap",
    description: "An olive cotton cap finished with a small botanical embroidery detail.",
    price: "54.00", category: "headwear", popularity: 76,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Casual", "Everyday"], work: ["Embroidery"], fabric: ["Cotton"], segment: ["Headwear"], suitableFor: ["Casual Wear", "Travel"], rawMaterials: ["Cotton"], pattern: ["Embroidered"] },
    images: [{ file: "olive-embroidered-cotton-cap.jpg", alt: "Olive cotton cap with cream botanical embroidery" }],
  },
  {
    slug: "chestnut-leather-travel-wallet", title: "Chestnut Leather Travel Wallet",
    description: "A slim chestnut leather wallet with a folded cover and neat stitching.",
    price: "64.00", category: "accessories", popularity: 62, customizable: true,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Everyday"], work: ["Leathercraft"], fabric: ["Leather"], segment: ["Accessories"], suitableFor: ["Travel", "Gifts"], rawMaterials: ["Leather"], pattern: ["Solid"] },
    images: [{ file: "chestnut-leather-travel-wallet.jpg", alt: "Chestnut brown stitched leather travel wallet" }],
  },
  {
    slug: "rose-striped-cotton-zipper-pouch", title: "Rose Striped Cotton Zipper Pouch",
    description: "A small rose and cream striped woven pouch with a top zipper.",
    price: "34.00", category: "accessories", popularity: 48,
    attributes: { idealFor: ["Women"], occasion: ["Everyday"], work: ["Handwoven"], fabric: ["Cotton"], segment: ["Accessories"], suitableFor: ["Travel", "Gifts"], rawMaterials: ["Cotton"], pattern: ["Striped"] },
    images: [{ file: "rose-striped-cotton-zipper-pouch.jpg", alt: "Rose and cream striped cotton zipper pouch" }],
  },
  {
    slug: "indigo-block-print-cushion-cover", title: "Indigo Block-Print Cushion Cover",
    description: "An indigo cotton cushion cover with a white botanical block print.",
    price: "69.00", category: "home", popularity: 70,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Everyday"], work: ["Handwoven"], fabric: ["Cotton"], segment: ["Home"], suitableFor: ["Home", "Gifts"], rawMaterials: ["Cotton"], pattern: ["Printed"] },
    images: [{ file: "indigo-block-print-cushion-cover.jpg", alt: "Indigo cushion cover with white botanical block print" }],
  },
  {
    slug: "ivory-handwoven-cotton-throw", title: "Ivory Handwoven Cotton Throw",
    description: "A soft ivory cotton throw with subtle woven stripes and fringe.",
    price: "118.00", category: "home", popularity: 60,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Everyday"], work: ["Handwoven"], fabric: ["Cotton"], segment: ["Home"], suitableFor: ["Home", "Gifts"], rawMaterials: ["Cotton"], pattern: ["Woven"] },
    images: [{ file: "ivory-handwoven-cotton-throw.jpg", alt: "Ivory woven cotton throw blanket with fringe" }],
  },
  {
    slug: "sage-linen-napkin-set", title: "Sage Linen Napkin Set",
    description: "A set of four sage linen napkins with softly finished hems.",
    price: "62.00", category: "home", popularity: 47,
    attributes: { idealFor: ["Men", "Women"], occasion: ["Everyday", "Party"], work: [], fabric: ["Linen"], segment: ["Home"], suitableFor: ["Home", "Gifts"], rawMaterials: ["Linen"], pattern: ["Solid"] },
    images: [{ file: "sage-linen-napkin-set.jpg", alt: "Stack of four sage green linen napkins" }],
  },
];

async function seed() {
  const categoryInput = Object.entries(categoryNames).map(([slug, name]) => ({ slug, name }));
  const { data: categoryRows, error: categoryError } = await supabase.from("categories")
    .upsert(categoryInput, { onConflict: "slug" }).select("id,slug");
  if (categoryError || !categoryRows) throw new Error(`Category seed failed: ${categoryError?.message ?? "No rows returned"}`);
  const categoryIds = new Map(categoryRows.map((row) => [row.slug, row.id]));

  const productInput = catalog.map((item, index) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    price: item.price,
    category_id: categoryIds.get(item.category)!,
    popularity: item.popularity,
    customizable: item.customizable ?? false,
    created_at: new Date(Date.UTC(2026, 5, 1 + index)).toISOString(),
    ideal_for: item.attributes.idealFor ?? [],
    occasion: item.attributes.occasion ?? [],
    work: item.attributes.work ?? [],
    fabric: item.attributes.fabric ?? [],
    segment: item.attributes.segment ?? [],
    suitable_for: item.attributes.suitableFor ?? [],
    raw_materials: item.attributes.rawMaterials ?? [],
    pattern: item.attributes.pattern ?? [],
  }));
  const { data: productRows, error: productError } = await supabase.from("products")
    .upsert(productInput, { onConflict: "slug" }).select("id,slug");
  if (productError || !productRows) throw new Error(`Product seed failed: ${productError?.message ?? "No rows returned"}`);
  const productIds = new Map(productRows.map((row) => [row.slug, row.id]));

  const { error: deleteError } = await supabase.from("product_images")
    .delete().in("product_id", productRows.map((row) => row.id));
  if (deleteError) throw new Error(`Product image reset failed: ${deleteError.message}`);

  const imageInput = catalog.flatMap((item) => item.images.map((image, position) => ({
    product_id: productIds.get(item.slug)!,
    position,
    url: `/products/${image.file}`,
    alt: image.alt,
  })));
  if (imageInput.length) {
    const { error: imageError } = await supabase.from("product_images").insert(imageInput);
    if (imageError) throw new Error(`Product image seed failed: ${imageError.message}`);
  }
  console.log(`Seeded ${catalog.length} products in ${categoryRows.length} categories`);
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
