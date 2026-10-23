const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// Prefixes internal paths with the deploy base so links work on both the preview sub-path and the root domain.
export const url = (path = '') => `${base}/${path.replace(/^\//, '')}`;

// Strips the deploy base so canonicals always point at the production path.
export const sitePath = (pathname: string) => pathname.replace(new RegExp(`^${base}`), '') || '/';
