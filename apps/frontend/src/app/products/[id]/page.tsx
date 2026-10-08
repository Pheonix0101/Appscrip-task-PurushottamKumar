import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CatalogApiError, getProduct } from "@/lib/catalog";
import { ImageIcon } from "@/components/icons";
import { WishlistButton } from "@/components/wishlist-button";
import { productStructuredData } from "@/lib/structured-data";
import { siteOrigin } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: product.title,
      description: product.description,
      alternates: { canonical: `/products/${id}` },
      openGraph: { title: product.title, description: product.description, url: `${siteOrigin}/products/${id}`, images: product.images[0] ? [product.images[0].url] : [] },
    };
  } catch { return { title: "Product" }; }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  let product;
  try { product = await getProduct(id); }
  catch (error) {
    if (error instanceof CatalogApiError && error.status === 404) notFound();
    return <main className="page-main"><section className="catalog-message"><h1>Product unavailable</h1><p>Please try again shortly.</p><Link href="/">Back to products</Link></section></main>;
  }
  const structuredData = productStructuredData(product);
  return <main className="page-main product-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Shop</Link><span aria-hidden="true">/</span><span>{product.category.name}</span></nav>
    <div className="product-page-layout">
      <div className="product-gallery">{product.images.length ? product.images.map((image, index) => <div className="detail-image" key={image.url}><Image src={image.url} alt={image.alt} fill sizes="(max-width: 800px) 100vw, 50vw" priority={index === 0} /></div>) : <div className="detail-image image-placeholder"><ImageIcon /><span>Image coming soon</span></div>}</div>
      <div className="product-summary"><p className="product-category">{product.category.name}</p><h1>{product.title}</h1><p className="detail-price">${Number(product.price).toFixed(2)}</p><p>{product.description}</p>{product.customizable && <p className="customizable-note">Customizable piece</p>}<div className="detail-actions"><WishlistButton id={product.id} title={product.title} /><span>Save to wishlist</span></div><Link href="/" className="back-link">← Back to all products</Link></div>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
  </main>;
}
