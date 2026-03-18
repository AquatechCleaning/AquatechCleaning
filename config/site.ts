export const siteConfig = {
  companyName: "Aquatech Cleaning",
  hoursText: "Mon–Sat: 07:00–18:00",
  phoneDisplay: "+27 (0)82 000 0000",
  phoneHref: "tel:+27820000000",
  cta: {
    quote: "/quote",
    book: "/quote",
  },
  socials: [
    { name: "Facebook",  href: "https://facebook.com",  shortLabel: "Fb" },
    { name: "Instagram", href: "https://instagram.com", shortLabel: "Ig" },
  ],
  nav: {
    main: [
      { href: "/",        label: "Home" },
      { href: "/gallery", label: "Gallery" },
      { href: "/about",   label: "About" },
      { href: "/contact", label: "Contact" },
    ],
    services: [
      { href: "/services#roof",       label: "Roof & Gutter Services" },
      { href: "/services#driveway",   label: "Driveway & Paving" },
      { href: "/services#commercial", label: "Commercial Cleaning" },
    ],
  },
};

export type SiteConfig = typeof siteConfig;
