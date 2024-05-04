import { Layout, getThemedContent } from '@brendanglancy/core-components';
import { en } from '@brendanglancy/i18n';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const BioPage = () => {
  const { theme } = useTheme();
  return (
    <Layout wrapperClass="main-aboutpage">
      <section className="about-area">
        <div className="container">
          <div className="d-flex about-me-wrap align-items-start gap-24">
            <div data-aos="zoom-in">
              <div className="about-image-box shadow-box">
                <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                <div className="image-inner">
                  <img src={en.bio.bio.media} alt="bio" />
                </div>
              </div>
            </div>
            <div className="about-details" data-aos="zoom-in">
              <h1 className="section-heading" data-aos="fade-up">
                <img src="/assets/star-2.png" alt="Star" />{' '}
                {en.bio.bio.details.heading}{' '}
                <img src="/assets/star-2.png" alt="Star" />
              </h1>
              <div className="about-details-inner shadow-box">
                <img src="/assets/icons/icon2.png" alt="Star" />
                <h1>{en.bio.bio.details.name}</h1>
                <p>{en.bio.bio.details.description}</p>
              </div>
            </div>
          </div>
          <div className="row mt-24">
            <div className="col-md-6" data-aos="zoom-in">
              <div className="about-edc-exp about-experience shadow-box">
                <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                <h3>{en.bio.experience.heading}</h3>
                <ul>
                  {en.bio.experience.experience.map((item, index) => (
                    <li key={index}>
                      <p className="date">{item.date}</p>
                      <h2>{item.title}</h2>
                      <p className="type">{item.company}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-6" data-aos="zoom-in">
              <div className="about-edc-exp about-education shadow-box">
                <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                <h3>{en.bio.education.heading}</h3>
                <ul>
                  {en.bio.education.education.map((item, index) => (
                    <li key={index}>
                      <p className="date">{item.date}</p>
                      <h2>{item.degree}</h2>
                      <p className="type">{item.university}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="row mt-24">
            <div className="col-md-12">
              <div className="d-flex profile-contact-credentials-wrap gap-24">
                <div data-aos="zoom-in" className="h-full">
                  <div className="about-crenditials-box info-box shadow-box">
                    <Link className="overlay-link" href="/credentials" />
                    <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                    <img src={en.bio.credentials.media} alt="Sign" />
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="infos">
                        <h4>{en.bio.credentials.caption}</h4>
                        <h1>{en.bio.credentials.heading}</h1>
                      </div>
                      <Link
                        href={en.bio.credentials.button.link}
                        className="about-btn"
                      >
                        <img
                          src={getThemedContent(
                            theme,
                            en.bio.credentials.button.icon
                          )}
                          alt="button"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
                <div data-aos="zoom-in" className="flex-1">
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
                        __html: en.bio.contact.heading,
                      }}
                    ></h1>
                    <Link
                      href={en.bio.contact.button.link}
                      className="about-btn"
                    >
                      <img
                        src={getThemedContent(
                          theme,
                          en.bio.contact.button.icon
                        )}
                        alt="button"
                      />
                    </Link>
                  </div>
                </div>
                <div data-aos="zoom-in">
                  <div className="about-profile-box info-box shadow-box h-full">
                    <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                    <div className="inner-profile-icons shadow-box">
                      {en.bio.profiles.profiles.map((item, index) => (
                        <Link href={item.link} key={index}>
                          <i className={item.icon} />
                        </Link>
                      ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="infos">
                        <h4>{en.bio.profiles.caption}</h4>
                        <h1>{en.bio.profiles.heading}</h1>
                      </div>
                      <Link
                        href={en.bio.profiles.button.link}
                        className="about-btn"
                      >
                        <img
                          src={getThemedContent(
                            theme,
                            en.bio.profiles.button.icon
                          )}
                          alt="button"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BioPage;
