import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { ImageIcon } from "./icons";
import { WishlistButton } from "./wishlist-button";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = product.images[0];
  return <article className="product-card">
    <Link className="product-image" href={`/products/${product.id}`} aria-label={`View ${product.title}`}>
      {image ? <Image src={image.url} alt={image.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" priority={priority} className="product-photo" /> : <span className="image-placeholder"><ImageIcon /><span>Image coming soon</span></span>}
      {!image && <span className="product-badge">NEW</span>}
    </Link>
    <div className="product-details">
      <h2><Link href={`/products/${product.id}`}>{product.title}</Link></h2>
      <p className="product-price">${Number(product.price).toFixed(2)}</p>
      <WishlistButton id={product.id} title={product.title} />
    </div>
  </article>;
}
