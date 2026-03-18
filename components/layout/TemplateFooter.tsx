import Link from "next/link";
import { siteConfig } from "@/config/site";

const footerThumbs = [
  "/template/images/footer-image1.jpg",
  "/template/images/footer-image2.jpg",
  "/template/images/footer-image3.jpg",
  "/template/images/footer-image4.jpg",
  "/template/images/footer-image5.jpg",
  "/template/images/footer-image6.jpg",
  "/template/images/footer-image7.jpg",
  "/template/images/footer-image8jpg.jpg",
  "/template/images/footer-image9.jpg",
];

export function TemplateFooter() {
  return (
    <footer>
      <div className="footer-container wow fadeInUp">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="footer-top">
                <div className="drop-one"><img src="/template/images/drop-shape.png" alt="drop" /></div>
                <div className="drop-two"><img src="/template/images/drop-shape.png" alt="drop" /></div>
                <div className="drop-three"><img src="/template/images/drop-shape.png" alt="drop" /></div>
                <div className="row">
                  <div className="col-xl-5">
                    <div className="footer-top-content">
                      <h3>Do not miss updates. Subscribe for cleaning tips.</h3>
                    </div>
                  </div>

                  <div className="col-xl-6 offset-xl-1">
                    <div className="footer-form">
                      <input type="email" placeholder="Your email address.." />
                      <button type="button" className="footer-form-icon"><i className="flaticon-email" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-12">
              <div className="footer-middle">
                <div className="drop-shape-one"><img src="/template/images/drop-shape.png" alt="drop" /></div>
                <div className="drop-shape-two"><img src="/template/images/drop-shape-small.png" alt="drop" /></div>
                <div className="row">
                  <div className="col-xl-4 col-lg-4 col-md-6">
                    <div className="footer-content">
                      <div className="footer-content-inner">
                        <div className="footer-logo"><img src="/Logo.png" alt="logo" /></div>
                        <p>Premium exterior cleaning for homes and commercial properties across Cape Town and surrounds.</p>
                        <div className="address">
                          <div className="address-icon"><i className="flaticon-map" /></div>
                          <div className="address-info">Cape Town, South Africa</div>
                        </div>
                        <div className="address">
                          <div className="address-icon"><i className="fa-solid fa-phone" /></div>
                          <div className="address-info">
                            <span>Start a New Project</span>
                            <Link href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-2 offset-xl-1 col-lg-2 col-md-6">
                    <div className="footer-content htr-footer-content">
                      <div className="footer-content-inner">
                        <h5>Links</h5>
                        <ul>
                          <li><Link href="/about">About</Link></li>
                          <li><Link href="/services">Our Services</Link></li>
                          <li><Link href="/gallery">Our Gallery</Link></li>
                          <li><Link href="/contact">Contact Us</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-2 col-lg-2 col-md-6">
                    <div className="footer-content htr-footer-content">
                      <div className="footer-content-inner">
                        <h5>Services</h5>
                        <ul>
                          {siteConfig.nav.services.map((s) => (
                            <li key={s.href}><Link href={s.href}>{s.label}</Link></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="footer-content footer-last-content htr-footer-content">
                      <div className="footer-content-inner footer-content-inner-last-child">
                        <div className="footer-desc-content"><h5>Our Gallery</h5></div>
                        <div className="footer-gallery">
                          {footerThumbs.map((src) => (
                            <a key={src} href={src} className="lightbox-image">
                              <div className="footer-gallery-item">
                                <img src={src} alt="image" />
                                <div className="footer-gallery-overlay"><div className="footer-gallery-overlay-plus">+</div></div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-12">
              <div className="footer-bottom-wrapper">
                <div className="footer-copyright">
                  <p>Copyrights © {new Date().getFullYear()} {siteConfig.companyName}. Privacy Policy / Booking Guide</p>
                </div>
                <div className="footer-media">
                  <ul>
                    {siteConfig.socials.map((social) => (
                      <li key={social.name}><a href={social.href}>{social.shortLabel}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bubbleContainer">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className={`bubble-${i + 1} bubble`} />
          ))}
        </div>
      </div>

      <div className="scroll-to-top">
        <div className="scroll-top-inner">
          <div className="scroll-bar"><div className="bar-inner" /></div>
          <div className="scroll-bar-text">Go To Top</div>
        </div>
      </div>
    </footer>
  );
}
