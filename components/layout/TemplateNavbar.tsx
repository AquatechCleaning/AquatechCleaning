"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export function TemplateNavbar() {
  const [open, setOpen] = useState(false);
  const socialIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("facebook")) return "fa-brands fa-facebook-f";
    if (n.includes("instagram")) return "fa-brands fa-instagram";
    if (n.includes("twitter")) return "fa-brands fa-twitter";
    if (n.includes("linkedin")) return "fa-brands fa-linkedin-in";
    if (n.includes("youtube")) return "fa-brands fa-youtube";
    return "fa-solid fa-globe";
  };

  return (
    <header>
      <div className="header-top">
        <div className="auto-container">
          <div className="row">
            <div className="col-xl-7">
              <div className="header-top-content-wrapper">
                <ul>
                  <li>
                    <Link href={siteConfig.phoneHref}><i className="flaticon-phone-call" />{siteConfig.phoneDisplay}</Link>
                  </li>
                  <li className="li-content">
                    <a href="mailto:hello@aquatechcleaning.co.za"><i className="flaticon-email" />hello@aquatechcleaning.co.za</a>
                  </li>
                  <li className="li-content"><i className="fa-regular fa-clock" />{siteConfig.hoursText}</li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 offset-xl-2 offset-md-0">
              <div className="hrader-top-info">
                <ul>
                  <li>Social Links :</li>
                  {siteConfig.socials.map((social) => (
                    <li key={social.name}>
                      <a href={social.href} aria-label={social.name}>
                        <i className={socialIcon(social.name)} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`mobile-menu-container ${open ? "active" : ""}`} style={{ display: open ? "block" : "none" }}>
        <div className="mobile-menu-close" onClick={() => setOpen(false)} />
        <div className="mobile-logo">
          <img src="/Logo.png" alt="logo" style={{ height: "56px", width: "auto", objectFit: "contain" }} />
        </div>
        <div id="mobile-menu-wrap">
          <ul className="menu" style={{ padding: "12px" }}>
            {siteConfig.nav.main.map((item) => (
              <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)}>{item.label}</Link></li>
            ))}
            {siteConfig.nav.services.map((item) => (
              <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="mobile-content">
          <ul>
            <li><Link href={siteConfig.phoneHref}><i className="fa-solid fa-phone" />{siteConfig.phoneDisplay}</Link></li>
            <li className="li-content"><a href="mailto:hello@aquatechcleaning.co.za"><i className="fa-regular fa-envelope" />hello@aquatechcleaning.co.za</a></li>
            <li className="li-content"><i className="fa-regular fa-clock" />{siteConfig.hoursText}</li>
          </ul>
        </div>
        <div className="mobile-info">
          <ul>
            <li>Social Links :</li>
            {siteConfig.socials.map((social) => (
              <li key={social.name}>
                <a href={social.href} aria-label={social.name}>
                  <i className={socialIcon(social.name)} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="header-menu-bar">
        <div className="main-menu-area header-menu-area ">
          <div className="auto-container">
            <div className="row">
              <div className="col-xl-2 col-lg-2">
                <div className="logo">
                  <Link href="/">
                    <img src="/Logo.png" alt="logo" style={{ height: "30px", width: "auto", objectFit: "contain" }} />
                  </Link>
                </div>
              </div>

              <div className="col-xl-10 col-lg-10">
                <div className="menu-bar">
                  <div className="header-navigation-area">
                    <nav className="main-navigation">
                      <div className="main-menu-container">
                        <ul id="main-menu" className="menu">
                          <li className="current-menu-item">
                            <Link href="/" className="active">Home</Link>
                          </li>

                          <li className="menu-item-has-children">
                            <Link href="/services">Services <i className="fa fa-angle-down" /></Link>
                            <ul className="sub-menu">
                              {siteConfig.nav.services.map((item) => (
                                <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
                              ))}
                              <li><Link href="/quote">Get Quote</Link></li>
                            </ul>
                          </li>

                          <li><Link href="/gallery">Gallery</Link></li>
                          <li><Link href="/about">Our Team</Link></li>
                          <li><Link href="/contact">Contact</Link></li>
                        </ul>
                      </div>
                    </nav>
                  </div>

                  <div className="header-buttons-area">
                    <div className="menu-right-info">
                      <button className="btn primary" type="button">
                        <i className="flaticon-search" />
                      </button>
                      <div className="menu-phone-icon"><Link href="/quote" className="common-btn">Get A Free Estimate</Link></div>
                    </div>

                    <ul className="header-buttons-wrapper wrd-list-style">
                      <li className="mobile-menu-trigger" onClick={() => setOpen(true)}><span /><span /><span /></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
