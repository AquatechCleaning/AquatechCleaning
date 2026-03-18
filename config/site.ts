export const siteConfig = {
  companyName: "Aquatech Cleaning",
  hoursText: "Mon-Sat: 07:00-18:00",
  phoneDisplay: "+27 (0)82 000 0000",
  phoneHref: "tel:+27820000000",
  cta: {
    quote: "/quote",
    book: "/quote",
  },
  socials: [
    { name: "Facebook", href: "https://facebook.com", shortLabel: "Fb" },
    { name: "Instagram", href: "https://instagram.com", shortLabel: "Ig" },
  ],
  nav: {
    main: [
      { href: "/", label: "Home" },
      { href: "/gallery", label: "Gallery" },
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "Our Team" },
      { href: "/contact", label: "Contact" },
    ],
    services: [
      { href: "/services#residential", label: "Residential Exterior Cleaning" },
      { href: "/services#commercial", label: "Commercial Property Cleaning" },
      { href: "/services#roof", label: "Roof and Gutter Services" },
    ],
  },
};

export type SiteConfig = typeof siteConfig;
