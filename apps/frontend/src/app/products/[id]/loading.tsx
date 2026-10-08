export default function ProductLoading() {
  return <main className="page-main product-page product-loading" aria-busy="true">
    <p className="visually-hidden" role="status">Loading product details…</p>
    <div className="breadcrumbs" aria-hidden="true">
      <span className="skeleton-line skeleton-breadcrumb" />
      <span>/</span>
      <span className="skeleton-line skeleton-breadcrumb skeleton-breadcrumb-long" />
    </div>
    <div className="product-page-layout" aria-hidden="true">
      <div className="product-gallery">
        <div className="detail-image skeleton-block" />
      </div>
      <div className="product-summary">
        <div className="skeleton-line skeleton-category" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-title-short" />
        <div className="skeleton-line skeleton-price" />
        <div className="product-loading-description">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-description-short" />
        </div>
        <div className="detail-actions">
          <div className="skeleton-block skeleton-action" />
          <div className="skeleton-line skeleton-action-label" />
        </div>
        <div className="skeleton-line skeleton-back-link" />
      </div>
    </div>
  </main>;
}
