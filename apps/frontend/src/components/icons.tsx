import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function SearchIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><circle cx="11" cy="11" r="8" /><path d="m20 20-3-3" /></svg>;
}
export function HeartIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="M12.6 20.8c-.3.1-.9.1-1.2 0C8.5 19.8 2 15.7 2 8.7 2 5.6 4.5 3.1 7.6 3.1c1.8 0 3.4.9 4.4 2.2 1-1.3 2.6-2.2 4.4-2.2 3.1 0 5.6 2.5 5.6 5.6 0 7-6.5 11.1-9.4 12.1Z" /></svg>;
}
export function ChevronIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="m6 9 6 6 6-6" /></svg>;
}
export function ImageIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-4-4a2 2 0 0 0-3 0l-8 10" /></svg>;
}
export function GridMark(props: IconProps) {
  return <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}><rect x="3" y="3" width="30" height="30" /><path d="M3 3l30 30M33 3 3 33M18 3c-8 8-8 22 0 30M18 3c8 8 8 22 0 30M3 18c8-8 22-8 30 0M3 18c8 8 22 8 30 0" /></svg>;
}
