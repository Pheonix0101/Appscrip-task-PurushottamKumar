export default function Loading() {
  return <main className="page-main"><section className="hero"><h1>Discover our products</h1><p>Loading the collection…</p></section><div className="loading-grid" aria-label="Loading products">{Array.from({ length: 9 }, (_, index) => <div className="loading-card" key={index} />)}</div></main>;
}
