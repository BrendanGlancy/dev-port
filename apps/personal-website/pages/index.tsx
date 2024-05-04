import { Layout, getThemedContent } from '@brendanglancy/core-components';
import { en } from '@brendanglancy/i18n';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Fragment } from 'react';

const LandingPage = () => {
  const { theme } = useTheme();

  return (
    <Layout>
      <section className="about-area">
        <div className="container">
          <div className="row">
            <div className="col-md-7" data-aos="zoom-in">
              <div className="about-me-box shadow-box">
                <Link className="overlay-link" href="/bio" />
                <img
                  className="bg-img"
                  src="/assets/bg1.png"
                  alt="background"
                />
                <div className="img-box">
                  <img src={en.landing.bio.media} alt="profile" />
                </div>
                <div className="infos">
                  <h4>{en.landing.bio.caption}</h4>
                  <h1>{en.landing.bio.heading}</h1>
                  <p>{en.landing.bio.description}</p>
                  <br />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: en.landing.bio.descriptionExtended,
                    }}
                  ></p>
                  <br />
                  <p>{en.landing.bio.location}</p>
                  <Link href={en.landing.bio.button.link} className="about-btn">
                    <img
                      src={getThemedContent(theme, en.landing.bio.button.icon)}
                      alt="Button"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="about-credentials-wrap">
                <div className="gx-row d-flex gap-24">
                  <div data-aos="zoom-in">
                    <div className="about-crenditials-box info-box shadow-box h-full">
                      <Link className="overlay-link" href="/credentials" />
                      <img
                        src="/assets/bg1.png"
                        alt="background"
                        className="bg-img"
                      />
                      <img
                        src={en.landing.credentials.media}
                        alt="credentials"
                      />
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="infos">
                          <h4>{en.landing.credentials.caption}</h4>
                          <h1>{en.landing.credentials.heading}</h1>
                        </div>
                        <Link
                          href={en.landing.credentials.button.link}
                          className="about-btn"
                        >
                          <img
                            src={getThemedContent(
                              theme,
                              en.landing.credentials.button.icon
                            )}
                            alt="button"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div data-aos="zoom-in">
                    <div className="about-project-box info-box shadow-box h-full">
                      <Link className="overlay-link" href="/portfolio" />
                      <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                      <img src={en.landing.cv.media} alt="My Works" />
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="infos">
                          <h4>{en.landing.cv.caption}</h4>
                          <h1>{en.landing.cv.heading}</h1>
                        </div>
                        <Link
                          href={en.landing.cv.button.link}
                          className="about-btn"
                        >
                          <img
                            src={getThemedContent(
                              theme,
                              en.landing.cv.button.icon
                            )}
                            alt="button"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div data-aos="zoom-in">
                  <div className="banner shadow-box">
                    <div className="marquee">
                      <div>
                        <span>
                          PERSONAL CV AND <b>BLOG</b>{' '}
                          <img src="/assets/star1.svg" alt="Star" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-24">
            <div className="col-md-12">
              <div className="blog-service-profile-wrap d-flex gap-24">
                <div data-aos="zoom-in">
                  <div className="about-blog-box info-box shadow-box h-full">
                    <Link href="/posts" className="overlay-link" />
                    <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                    <img src={en.landing.blog.media} alt="thumbnail" />
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="infos">
                        <h4>{en.landing.blog.caption}</h4>
                        <h1>{en.landing.blog.heading}</h1>
                      </div>
                      <Link
                        href={en.landing.blog.button.link}
                        className="about-btn"
                      >
                        <img
                          src={getThemedContent(
                            theme,
                            en.landing.blog.button.icon
                          )}
                          alt="button"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div data-aos="zoom-in" className="flex-1">
                  <div className="about-services-box info-box shadow-box h-full">
                    <Link
                      href={en.landing.offerings.link}
                      className="overlay-link"
                    />
                    <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                    {/* <img src={en.landing.offerings.media} alt="thumbnail" /> */}
                    <div className="icon-boxes">
                      {en.landing.offerings.icons.map((item, index) => (
                        <i key={index} className={item} />
                      ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="infos">
                        <h4>{en.landing.offerings.caption}</h4>
                        <h1>{en.landing.offerings.heading}</h1>
                      </div>
                      <Link
                        href={en.landing.offerings.button.link}
                        className="about-btn"
                      >
                        <img
                          src={getThemedContent(
                            theme,
                            en.landing.offerings.button.icon
                          )}
                          alt="Button"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div data-aos="zoom-in">
                  <div className="about-profile-box info-box shadow-box h-full">
                    <img src="/assets/bg1.png" alt="BG" className="bg-img" />

                    {Array.from(
                      {
                        length: Math.ceil(
                          en.landing.profiles.profiles.length / 2
                        ),
                      },
                      (_, i) => i * 2
                    ).map((startIndex, index) => (
                      <div
                        className="inner-profile-icons shadow-box"
                        key={index}
                      >
                        {en.landing.profiles.profiles
                          .slice(startIndex, startIndex + 2)
                          .map((item, i) => (
                            <a
                              href={item.link}
                              key={i}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              <i className={item.icon} />
                            </a>
                          ))}
                      </div>
                    ))}

                    <div className="d-flex align-items-center justify-content-between">
                      <div className="infos">
                        <h4>{en.landing.profiles.caption}</h4>
                        <h1>{en.landing.profiles.heading}</h1>
                      </div>
                      <Link
                        href={en.landing.profiles.button.link}
                        className="about-btn"
                      >
                        <img
                          src={getThemedContent(
                            theme,
                            en.landing.profiles.button.icon
                          )}
                          alt="Button"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-24">
            <div className="col-md-6" data-aos="zoom-in">
              <div className="about-client-box info-box shadow-box">
                <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                <div className="clients d-flex align-items-start gap-24 justify-content-center">
                  {en.landing.facts.quickFacts.map((item, index) => (
                    <div className="client-item" key={index}>
                      <h1>{item.count}</h1>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: item.label,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-6" data-aos="zoom-in">
              <div className="about-contact-box info-box shadow-box">
                <Link className="overlay-link" href="/contact" />
                <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                <img
                  src="/assets/icons/icon2.png"
                  alt="Icon"
                  className="star-icon"
                />
                <h1
                  dangerouslySetInnerHTML={{
                    __html: en.landing.contact.heading,
                  }}
                ></h1>
                <Link
                  href={en.landing.contact.button.link}
                  className="about-btn"
                >
                  <img
                    src={getThemedContent(
                      theme,
                      en.landing.contact.button.icon
                    )}
                    alt="button"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
