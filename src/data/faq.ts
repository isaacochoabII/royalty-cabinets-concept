export type FaqItem = {q: string; a: string};

// FAQPage structured data from the same items the page renders, so the two never drift apart.
export const faqSchema = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({q, a}) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: {'@type': 'Answer', text: a.replace(/<[^>]+>/g, '')},
  })),
});

export const serviceSchema = (name: string, description: string, serviceType: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  serviceType,
  description,
  provider: {'@id': 'https://royaltycabinets.ca/#business'},
  areaServed: ['Moncton', 'Dieppe', 'Riverview', 'New Brunswick', 'Nova Scotia', 'Prince Edward Island'],
});
