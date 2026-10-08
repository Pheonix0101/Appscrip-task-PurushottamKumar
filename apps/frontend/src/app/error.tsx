"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="page-main"><section className="catalog-message" role="alert"><h1>Something went wrong</h1><p>We could not load this page.</p><button type="button" onClick={reset}>Try again</button></section></main>;
}
