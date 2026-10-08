import type { Product } from "./catalog";
import { siteOrigin } from "./site-config";

export { siteOrigin };

const homeUrl = siteOrigin + "/";
const websiteId = homeUrl + "#website";
const organizationId = homeUrl + "#organization";

function siteEntities() {
  return [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: homeUrl,
      name: "mettā muse",
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "mettā muse",
      url: homeUrl,
    },
  ];
}

function productUrl(product: Product) {
  return siteOrigin + "/products/" + product.id;
}

function productEntity(product: Product, detailed = true) {
  const url = productUrl(product);
  const images = detailed ? product.images : product.images.slice(0, 1);
  return {
    "@type": "Product",
    "@id": url + "#product",
    url,
    name: product.title,
    ...(detailed ? { description: product.description, category: product.category.name } : {}),
    ...(images.length ? { image: images.map((image) => siteOrigin + image.url) } : {}),
    offers: {
      "@type": "Offer",
      "@id": url + "#offer",
      url,
      price: product.price,
      priceCurrency: "USD",
    },
  };
}

export function listingStructuredData({
  url,
  title,
  description,
  products,
}: {
  url: string;
  title: string;
  description: string;
  products: Product[];
}) {
  const pageId = url + "#webpage";
  const listId = url + "#itemlist";
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...siteEntities(),
      {
        "@type": "CollectionPage",
        "@id": pageId,
        url,
        name: title,
        description,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": listId },
      },
      {
        "@type": "ItemList",
        "@id": listId,
        name: title,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: productEntity(product, false),
        })),
      },
    ],
  };
}

export function productStructuredData(product: Product) {
  const url = productUrl(product);
  const pageId = url + "#webpage";
  const breadcrumbId = url + "#breadcrumb";
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...siteEntities(),
      {
        "@type": "WebPage",
        "@id": pageId,
        url,
        name: product.title,
        description: product.description,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": url + "#product" },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Shop", item: homeUrl },
          { "@type": "ListItem", position: 2, name: product.category.name, item: homeUrl + "?category=" + encodeURIComponent(product.category.slug) },
          { "@type": "ListItem", position: 3, name: product.title, item: url },
        ],
      },
      productEntity(product),
    ],
  };
}
