import Link from "next/link";
import { ChevronIcon, GridMark, SearchIcon } from "./icons";

export function SiteHeader() {
  return <>
    <div className="announcement" aria-label="Store highlights">
      <span>Thoughtfully made</span><span>Crafted to last</span><span>Everyday discoveries</span>
    </div>
    <header className="site-header">
      <div className="header-main">
        <Link className="brand-mark" href="/" aria-label="mettā muse home"><GridMark /></Link>
        <Link className="brand-name" href="/">LOGO</Link>
        <div className="header-actions"><a href="/#catalog-search-form" aria-label="Search products"><SearchIcon /></a><span className="header-language">ENG <ChevronIcon /></span></div>
      </div>
      <nav className="primary-nav" aria-label="Main navigation">
        <Link href="/#products">SHOP</Link>
        <a href="#about">ABOUT</a>
        <a href="#contact">CONTACT US</a>
      </nav>
    </header>
  </>;
}
