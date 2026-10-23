// Single source for business details, facts and review excerpts.
// Facts marked "confirm" still need Raphael's sign-off before launch (see strategy/royalty-strategy.md §9).

// Contact details verified by the client (design system v1.1). Never use (506) 855-3043, the old number on the van.
export const business = {
  name: 'Royalty Cabinets',
  phone: '(506) 875-1527',
  tel: '+15068751527',
  email: 'info@royaltycabinets.ca',
  street: '571 Ferdinand Blvd',
  city: 'Dieppe',
  region: 'NB',
  postal: 'E1A 0N7',
  facebook: 'https://www.facebook.com/RoyaltyCabinet/',
  // From Raphael on camera: Moncton, Riverview, Greater Moncton, Nova Scotia, PEI; Phil: Fredericton projects.
  areas: ['Moncton', 'Dieppe', 'Riverview', 'Fredericton', 'Nova Scotia', 'Prince Edward Island'],
};

// Where form submissions go (e.g. a Formspree or Basin URL). Empty = forms show a "call or text" notice instead.
export const formEndpoint: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

// Keeps the GitHub Pages preview out of Google so it never competes with royaltycabinets.ca.
export const noindex = import.meta.env.PUBLIC_NOINDEX === 'true';

export const nav = [
  {href: 'builders/', label: 'Builders & developers'},
  {href: 'installation/', label: 'Installation'},
  {href: 'ikea-kitchen-installation-moncton/', label: 'IKEA kitchens'},
  {href: 'about-us/', label: 'About'},
];

export const facts = {
  rating: '5.0',
  reviewCount: 19,
  // Approved in the design system (per royaltycabinets.ca). Confirm with the client before raising it.
  installed: '500+',
  installedLabel: 'apartments and condos',
};

export type Review = {quote: string; name: string; context: string};

// Word-for-word excerpts from public Google reviews (full text in strategy/research/google-reviews.md).
// Pending: the design system asks for each reviewer's permission before featuring them,
// and the 84-unit developer stays unnamed until the client confirms.
export const reviews: Record<string, Review> = {
  pierre: {
    quote:
      'When the cabinet manufacturer fell short on pre-planning and created some serious logistical challenges, Royalty Cabinets stepped up without missing a beat. They identified the issues, developed solutions on the fly, and kept the entire project on schedule. Without their involvement, hitting that opening date simply would not have been possible.',
    name: 'Developer',
    context: '84-unit build',
  },
  lyndi: {
    quote:
      'The work is amazing, 16 beautiful kitchens, all done in a timely manner. Raphael even took a call while on vacation.',
    name: 'Lyndi',
    context: 'New builds · 16 kitchens',
  },
  brendon: {
    quote:
      'Communication was excellent throughout — they kept us informed at all time. The project was completed on time, which made a big difference for our overall timeline.',
    name: 'Brendon',
    context: 'Multi-residential projects',
  },
  lewis: {
    quote:
      'Raphael and team get the job done, and quickly. But they don’t sacrifice the little details. Clean up and getting the final stuff done really sets them above the rest.',
    name: 'Lewis',
    context: 'BluePrint Cabinets · cabinet supplier',
  },
  shawn: {
    quote: 'Raphael is passionate about what he does, that leads to an organized team!',
    name: 'Shawn’s Electric',
    context: 'Electrical contractor',
  },
  chrissy: {
    quote:
      'We trusted Royalty Cabinets with our 15-unit apartment project in Moncton, and the entire experience was excellent from start to finish.',
    name: 'Chrissy',
    context: '15-unit apartment project · Moncton',
  },
  hailey: {
    quote: 'Consistently providing in depth knowledge and advice. Professional, experienced & kind!',
    name: 'Hailey',
    context: 'Google review',
  },
  jg: {
    quote: 'This team is incredible! They leave a positive vibe wherever they work!',
    name: 'JG',
    context: 'Google review',
  },
  nicolas: {
    quote: 'Next time you need cabinets installed, call these guys!',
    name: 'Nicolas',
    context: 'Google review',
  },
};
