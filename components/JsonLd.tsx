import { site, siteUrl } from '@/lib/site';

/**
 * Schema.org structured data. Factual particulars only: Rule 36 rules out
 * aggregateRating, review and award properties, so none are emitted.
 */
export default function JsonLd() {
  const { contact, about } = site;
  const languages = about.facts.find((fact) => fact.term === 'Languages')?.detail.split(' · ');

  const data = {
    '@context': 'https://schema.org',
    '@type': ['LegalService', 'LocalBusiness'],
    '@id': `${siteUrl}/#chambers`,
    name: site.name,
    alternateName: site.shortName,
    description: site.meta.description,
    url: `${siteUrl}/`,
    image: `${siteUrl}/og.png`,
    telephone: contact.phones[0].tel,
    contactPoint: contact.phones.map((phone) => ({
      '@type': 'ContactPoint',
      telephone: phone.tel,
      contactType: 'reception',
      areaServed: 'IN',
      availableLanguage: languages,
    })),
    ...(site.email ? { email: site.email } : {}),
    foundingDate: site.founded,
    founder: { '@type': 'Person', name: site.advocate, jobTitle: 'Advocate' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address.street,
      addressLocality: contact.address.locality,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    hasMap: contact.map.link,
    areaServed: { '@type': 'City', name: 'Hyderabad' },
    knowsLanguage: languages,
    knowsAbout: site.practice.areas.map((area) => area.title),
    openingHoursSpecification: contact.hours.map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot close the script element
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
