export const siteConfig = {
  companyName: "Aquatech Cleaning",
  hoursText: "Mon–Sat: 07:00–18:00",
  phoneDisplay: "071 628 9947",
  phoneHref: "tel:+27716289947",
  email: "aston@aquatechcleaning.co.za",
  whatsapp: "https://wa.me/27844949449",
  cta: {
    quote: "/quote",
    book: "/quote",
  },
  socials: [
    { name: "Facebook",  href: "https://www.facebook.com/share/17mqi6RrNs/",  shortLabel: "Fb" },
    { name: "Instagram", href: "https://www.instagram.com/more.aquatech.cleaning?igsh=YWtyb2p0c290ZTFi", shortLabel: "Ig" },
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
