import Link from "next/link";
import { HeroBanner } from "@/components/home/HeroBanner";
import { MissionBeforeAfter } from "@/components/home/MissionBeforeAfter";
import { MissionBeforeAfterLarge } from "@/components/home/MissionBeforeAfterLarge";

type PublicStats = {
  clientsServed: number;
  totalSqmCleaned: number;
  averageRating: number;
  repeatCustomerRate: number;
};

type Testimonial = {
  _id: string;
  name: string;
  location?: string;
  rating: number;
  comment: string;
};

type MediaItem = {
  _id: string;
  title: string;
  locationLabel?: string;
  imageBeforeUrl: string;
  imageAfterUrl: string;
};

async function getStats(): Promise<PublicStats> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(new URL("/api/stats/public", base).toString(), { next: { revalidate: 60 } });
  if (!res.ok) return { clientsServed: 0, totalSqmCleaned: 0, averageRating: 0, repeatCustomerRate: 0 };
  return res.json();
}

async function getTestimonials(): Promise<Testimonial[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = new URL("/api/testimonials", base);
  url.searchParams.set("featured", "true");
  const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
  if (!res.ok) return [];
  return res.json();
}

async function getMedia(): Promise<MediaItem[]> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = new URL("/api/media", base);
  url.searchParams.set("featured", "true");
  const res = await fetch(url.toString(), { next: { revalidate: 1200 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const [stats, testimonials, media] = await Promise.all([getStats(), getTestimonials(), getMedia()]);
  const topTestimonials = testimonials.slice(0, 3);
  const gallery = media.slice(0, 9);

  return (
    <>
      <HeroBanner />

      <section className="mission">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="mission-left-content wow fadeInUp">
                <div className="mission-image-one">
                  <div
                    style={{
                      width: "477.35px",
                      height: "598.82px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      display: "block",
                      transform: "rotate(-6deg)",
                      transformOrigin: "center center",
                    }}
                  >
                    <MissionBeforeAfterLarge />
                  </div>
                </div>
                <div className="mission-image-two wow zoomInRight" style={{ zIndex: 8, width: "273.06px", height: "279.96px" }}>
                  <MissionBeforeAfter />
                </div>
                <div className="mission-shape-one">
                  <img src="/template/images/mission-shape-01.png" alt="shape" />
                </div>
                <div className="mission-shape-two">
                  <img src="/template/images/mission-shape-02.png" alt="shape" />
                </div>
              </div>
            </div>

            <div className="col-xl-6">
                <div className="mission-right-content wow fadeInUp">
                  <div className="common-title">
                    <span>Our Mission</span>
                    <h3>To set the standard for professional exterior cleaning in Cape Town.</h3>
                  </div>
                <h6>By combining modern equipment with surface-safe techniques, we deliver powerful results while protecting your property.</h6>
                <ul>
                  <li>
                    <i className="fa-solid fa-check" />
                    <p>Specialised cleaning for residential and commercial exteriors</p>
                  </li>
                  <li>
                    <i className="fa-solid fa-check" />
                    <p>Quality-driven service with clear communication every step</p>
                  </li>
                </ul>
                <div className="mission-right-wrapper">
                  <div className="mission-btn">
                    <Link href="/about" className="btn-3">
                      Learn More
                    </Link>
                  </div>
                  <div className="mission-exp">
                    <div className="exp-image">
                      <img src="/template/images/mission-exp.png" alt="experience" />
                    </div>
                    <span>10+ Years Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="video">
        <div className="vedio-shape">
          <img src="/template/images/banner-shape.png" alt="shape" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8">
              <div className="vedio-left-content wow fadeInUp">
                <div className="common-title vedio-title">
                  <span>WATCH MORE</span>
                  <h3>Our team will do its best to accommodate every project requirement.</h3>
                  <p>
                    Use the instant quote flow to map your areas, submit details, and get tailored pricing quickly.
                  </p>
                  <Link href="/quote" className="btn-1">Discover Now</Link>
                </div>
              </div>
            </div>

            <div className="col-xl-3 offset-xl-1 col-lg-4 ">
              <div className="video-right-content wow fadeInRight">
                <div className="video-right-content-wrapper">
                  <div className="cta-vedio-button">
                    <Link href="/quote" className="vedio-popup-link"><i className="fas fa-play" /></Link>
                  </div>
                  <span>Watch Video</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="counter-section">
        <div className="container">
          <div className="row counter-contrnt wow fadeInUp">
            {[
              { icon: "icon-f-01", value: stats.clientsServed, label: "Clients Served" },
              { icon: "icon-f-02", value: stats.totalSqmCleaned, label: "Total m2 Cleaned" },
              { icon: "icon-f-03", value: Number(stats.averageRating).toFixed(1), label: "Average Rating" },
              { icon: "icon-f-04", value: `${stats.repeatCustomerRate}%`, label: "Repeat Customers", border: true },
            ].map((item) => (
              <div className="col-xl-3  col-lg-3 col-md-6 d-flex justify-content-center align-items-center" key={item.label}>
                <div className={`counter-content ${item.border ? "counter-border" : ""}`}>
                  <i className={item.icon} />
                  <h3 className="counter">{item.value}</h3>
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="service">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="common-title text-center">
                <span>Our Services</span>
                <h3>Exterior cleaning services built for durability and curb appeal.</h3>
              </div>
            </div>
          </div>
          <div className="row">
            {[
              { title: "Roof Cleaning", img: "/template/images/service-image-01.jpg", icon: "icon-f-06" },
              { title: "Driveway Cleaning", img: "/template/images/service-image-02.jpg", icon: "icon-f-01" },
              { title: "Facade Washing", img: "/template/images/service-image-03.jpg", icon: "icon-s-02" },
            ].map((service) => (
              <div className="col-xl-4 col-lg-4" key={service.title}>
                <div className="service-container wow fadeInUp">
                  <div className="service-content-wrapper">
                    <div className="service-content-wrapper-overlay wow" />
                    <div className="service-image">
                      <img src={service.img} alt={service.title} />
                      <i className={service.icon} />
                    </div>
                  </div>
                  <div className="service-info">
                    <h5>{service.title}</h5>
                    <p>Professional equipment, trained teams, and care for every surface.</p>
                    <Link href="/services">Read More <i className="fa-solid fa-angles-right" /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="choose">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="choose-left-content wow fadeInUp">
                <div className="choose-image-one">
                  <img src="/template/images/choose-image-01.png" alt="choose" />
                </div>
                <div className="choose-image-border">
                  <img src="/template/images/choose-image-border.png" alt="border" />
                </div>
                <div className="choose-shape">
                  <img src="/template/images/choose-shape.png" alt="shape" />
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="choose-right-content wow fadeInUp">
                <div className="common-title">
                  <span>Why Choose Us</span>
                  <h3>Dependable cleaning outcomes for homes and commercial properties.</h3>
                </div>
                <p>
                  We combine practical field experience with quality control and client-first communication.
                </p>
                <ul>
                  <li><i className="fa-solid fa-check" /> Trained and safety-focused teams</li>
                  <li><i className="fa-solid fa-check" /> Transparent pricing and scope</li>
                  <li><i className="fa-solid fa-check" /> Fast turnaround and reliable scheduling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="faq-left-content wow fadeInUp">
                <div className="common-title">
                  <span>FAQ</span>
                  <h3>Answers to common cleaning and quoting questions.</h3>
                </div>
                <div className="accordion" id="faqAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button" type="button">How fast can I get a quote?</button>
                    </h2>
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body">Usually within minutes through our online quote page.</div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button">Do you service commercial sites?</button>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="faq-right-content wow fadeInRight">
                <img src="/template/images/faq-image.png" alt="faq" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="common-title text-center">
                <span>Our Team</span>
                <h3>Experienced professionals focused on quality delivery.</h3>
              </div>
            </div>
          </div>
          <div className="row">
            {["team-01.jpg", "team-02.jpg", "team-03.jpg", "team-04.jpg"].map((img, idx) => (
              <div className="col-xl-3 col-lg-3 col-md-6" key={img}>
                <div className="team-content wow fadeInUp">
                  <div className="team-image">
                    <img src={`/template/images/${img}`} alt={`Team ${idx + 1}`} />
                  </div>
                  <h5>Team Member {idx + 1}</h5>
                  <p>Cleaning Specialist</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonial">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="common-title text-center">
                <span>Testimonials</span>
                <h3>What clients say after service delivery.</h3>
              </div>
            </div>
          </div>
          <div className="row">
            {topTestimonials.length === 0 ? (
              <div className="col-xl-12">
                <p className="text-center">Add featured testimonials in admin to populate this section.</p>
              </div>
            ) : (
              topTestimonials.map((t) => (
                <div className="col-xl-4 col-lg-4" key={t._id}>
                  <div className="testimonial-content wow fadeInUp" style={{ minHeight: 260 }}>
                    <h5>{t.name}</h5>
                    <span>{t.location || "Cape Town"}</span>
                    <p>{t.comment}</p>
                    <strong>Rating: {t.rating}/5</strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="gellary">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="common-title text-center">
                <span>Photo Gallery</span>
                <h3>Before and after transformations from recent projects.</h3>
              </div>
            </div>
          </div>
          <div className="row">
            {(gallery.length > 0 ? gallery : []).map((item) => (
              <div className="col-xl-4 col-lg-4 col-md-6" key={item._id}>
                <div className="gallery-image">
                  <a href={item.imageAfterUrl}>
                    <div className="footer-gallery-item main-gallery-item">
                      <img src={item.imageAfterUrl} alt={item.title} />
                      <div className="footer-gallery-overlay main-gallery-overlay">
                        <div className="footer-gallery-overlay-plus main-gallery-overlay-plus">+</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blog">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="common-title text-center">
                <span>From Our Blog</span>
                <h3>Practical cleaning tips and maintenance guidance.</h3>
              </div>
            </div>
          </div>
          <div className="row">
            {["blog-01.jpg", "blog-02.jpg", "blog-03.jpg"].map((img, idx) => (
              <div className="col-xl-4 col-lg-4" key={img}>
                <div className="service-container blog-container wow fadeInUp">
                  <div className="service-content-wrapper">
                    <div className="service-content-wrapper-overlay wow" />
                    <div className="service-image blog-image">
                      <img src={`/template/images/${img}`} alt={`Blog ${idx + 1}`} />
                    </div>
                  </div>
                  <div className="service-info">
                    <span>Cleaning Tips / Updated Weekly</span>
                    <h5>How to maintain your exterior surfaces between professional cleans.</h5>
                    <Link href="/services">More Details <i className="icon-arrow" /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}


