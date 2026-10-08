export const facets = [
  { key: "idealFor", label: "Ideal for", options: ["Men", "Women", "Baby & Kids"] },
  { key: "occasion", label: "Occasion", options: ["Casual", "Party", "Everyday"] },
  { key: "work", label: "Work", options: ["Handwoven", "Crochet", "Embroidery", "Leathercraft"] },
  { key: "fabric", label: "Fabric", options: ["Cotton", "Linen", "Leather", "Jute", "Recycled Fiber"] },
  { key: "segment", label: "Segment", options: ["Bags", "Accessories", "Toys", "Headwear", "Home"] },
  { key: "suitableFor", label: "Suitable for", options: ["Casual Wear", "Travel", "Gifts", "Home"] },
  { key: "rawMaterials", label: "Raw materials", options: ["Cotton", "Linen", "Leather", "Jute", "Recycled Fiber"] },
  { key: "pattern", label: "Pattern", options: ["Solid", "Striped", "Woven", "Embroidered", "Printed"] },
] as const;

export type FacetKey = (typeof facets)[number]["key"];
