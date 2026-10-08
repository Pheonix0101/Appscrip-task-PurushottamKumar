"use client";

import { FormEvent, ReactNode, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category, Facet } from "@/lib/catalog";
import { ChevronIcon, SearchIcon } from "./icons";

const sorts = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest first" },
  { value: "popular", label: "Popular" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "price_asc", label: "Price: low to high" },
];

export function ListingControls({ categories, facets, total, children }: { categories: Category[]; facets: Facet[]; total: number; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [desktopFilters, setDesktopFilters] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [priceScrollTarget, setPriceScrollTarget] = useState<string | null>(null);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (priceScrollTarget === null || isPending || searchParams.toString() !== priceScrollTarget) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("product-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPriceScrollTarget(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [priceScrollTarget, isPending, searchParams]);

  function navigate(changes: Record<string, string | string[] | null>, scrollToResults = false) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      next.delete(key);
      if (Array.isArray(value)) value.forEach((item) => next.append(key, item));
      else if (value) next.set(key, value);
    }
    next.delete("page");
    setPriceScrollTarget(scrollToResults ? next.toString() : null);
    startTransition(() => router.push(`${pathname}${next.size ? `?${next.toString()}` : ""}`, { scroll: false }));
  }

  function toggleValue(key: string, value: string) {
    const selected = searchParams.getAll(key);
    navigate({ [key]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] });
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({ q: search.trim() || null });
  }

  function submitPrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMobileFilters(false);
    navigate({ minPrice: minPrice || null, maxPrice: maxPrice || null }, true);
  }

  const isCustomizable = searchParams.get("customizable") === "true";
  const selectedSort = searchParams.get("sort") ?? "recommended";
  const selectedSortLabel = sorts.find((sort) => sort.value === selectedSort)?.label ?? "Recommended";

  return <>
    <div className="listing-toolbar" id="products">
      <strong className="item-count">{total} items</strong>
      <button type="button" className="filter-toggle desktop-filter-toggle" aria-expanded={desktopFilters} aria-controls="listing-filters" onClick={() => setDesktopFilters((value) => !value)}><ChevronIcon />{desktopFilters ? "Hide filter" : "Show filter"}</button>
      <button type="button" className="filter-toggle mobile-filter-toggle" aria-expanded={mobileFilters} aria-controls="listing-filters" aria-label={mobileFilters ? "Hide filters" : "Show filters"} onClick={() => setMobileFilters((value) => !value)}><ChevronIcon />Filter</button>
      <label className="sort-label"><span className="sort-prompt">Sort by</span><select aria-label="Sort products" value={selectedSort} onChange={(event) => navigate({ sort: event.target.value === "recommended" ? null : event.target.value })}>{sorts.map((sort) => <option key={sort.value} value={sort.value}>{sort.label}</option>)}</select><span className="sort-selection" aria-hidden="true">{selectedSortLabel}</span><ChevronIcon /></label>
    </div>
    <div className={`listing-content${desktopFilters ? "" : " filters-hidden"}${mobileFilters ? " mobile-filters-open" : ""}`} aria-busy={isPending}>
      <aside className="filter-sidebar" id="listing-filters" aria-label="Product filters">
        <form className="search-form" id="catalog-search-form" role="search" onSubmit={submitSearch}>
          <label htmlFor="catalog-search">Search products</label>
          <div className="search-field"><input id="catalog-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the collection" maxLength={100} /><button type="submit" aria-label="Search"><SearchIcon /></button></div>
        </form>
        <label className="customizable-filter"><input type="checkbox" checked={isCustomizable} onChange={() => navigate({ customizable: isCustomizable ? null : "true" })} />Customizable</label>
        <details className="filter-group" open>
          <summary><span><strong>Category</strong><small>{categories.find((category) => category.slug === searchParams.get("category"))?.name ?? "All"}</small></span><ChevronIcon /></summary>
          <div className="filter-options"><button type="button" className="unselect-button" onClick={() => navigate({ category: null })}>Unselect all</button>{categories.map((category) => <label key={category.id}><input type="radio" name="category" checked={searchParams.get("category") === category.slug} onChange={() => navigate({ category: category.slug })} />{category.name}</label>)}</div>
        </details>
        {facets.map((facet, index) => {
          const selected = searchParams.getAll(facet.key);
          return <details className="filter-group" key={facet.key} open={index === 0}>
            <summary><span><strong>{facet.label}</strong><small>{selected.length ? selected.join(", ") : "All"}</small></span><ChevronIcon /></summary>
            <div className="filter-options"><button type="button" className="unselect-button" onClick={() => navigate({ [facet.key]: null })}>Unselect all</button>{facet.options.map((option) => <label key={option}><input type="checkbox" checked={selected.includes(option)} onChange={() => toggleValue(facet.key, option)} />{option}</label>)}</div>
          </details>;
        })}
        <details className="filter-group" open>
          <summary><span><strong>Price</strong><small>{minPrice || maxPrice ? `$${minPrice || "0"} – $${maxPrice || "any"}` : "All"}</small></span><ChevronIcon /></summary>
          <form className="price-form" onSubmit={submitPrice}><label>Min <input type="number" min="0" max="1000000" step="0.01" inputMode="decimal" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="0" /></label><label>Max <input type="number" min="0" max="1000000" step="0.01" inputMode="decimal" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Any" /></label><button type="submit">Apply price</button></form>
        </details>
        <button type="button" className="clear-filters" onClick={() => startTransition(() => router.push(pathname, { scroll: false }))}>Clear all filters</button>
      </aside>
      <div className="product-results" id="product-results">{children}</div>
    </div>
  </>;
}
