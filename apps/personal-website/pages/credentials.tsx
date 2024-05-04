
import { Layout } from '@brendanglancy/core-components';
import { en } from '@brendanglancy/i18n';
import Link from 'next/link';

const CredentialsPage = () => {
  return (
    <Layout wrapperClass="main-aboutpage">
      <section className="credential-area">
        <div className="container">
          <div className="gx-row d-flex">
            <div className="credential-sidebar-wrap" data-aos="zoom-in">
              <div className="credential-sidebar text-center">
                <div className="shadow-box">
                  <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                  <div className="img-box">
                    <img src={en.credentials.navbar.media} alt="bio" />
                  </div>
                  <h2>{en.credentials.navbar.heading}</h2>
                  <p>{en.credentials.navbar.email}</p>
                  <ul className="social-links d-flex justify-content-center">
                    {en.credentials.navbar.profiles.map((item, index) => (
                      <li key={index}>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <i className={item.icon} />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={en.credentials.navbar.button.link}
                    className="theme-btn"
                  >
                    {en.credentials.navbar.button.text}
                  </Link>
                </div>
              </div>
            </div>
            <div className="credential-content flex-1">
              <div className="credential-about" data-aos="zoom-in">
                <h2>{en.credentials.bio.heading}</h2>
                {en.credentials.bio.description.map((item, index) => (
                  <p
                    key={index}
                    dangerouslySetInnerHTML={{
                      __html: item,
                    }}
                  />
                ))}
              </div>
              <div className="credential-edc-exp credential-experience">
                <h2 data-aos="fade-up">{en.credentials.experience.heading}</h2>
                {en.credentials.experience.experience.map((item, index) => (
                  <div
                    className="credential-edc-exp-item"
                    data-aos="zoom-in"
                    key={index}
                  >
                    <h4>{item.date}</h4>
                    <h3>{item.title}</h3>
                    <h5>{item.company}</h5>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: item.description,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="credential-edc-exp credential-education">
                <h2 data-aos="fade-up">{en.credentials.education.heading}</h2>
                {en.credentials.education.education.map((item, index) => (
                  <div
                    className="credential-edc-exp-item"
                    data-aos="zoom-in"
                    key={index}
                  >
                    <h4>{item.date}</h4>
                    <h3>{item.degree}</h3>
                    <h5>{item.university}</h5>
                    {item.description && (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: item.description,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="skills-wrap">
                <h2 data-aos="fade-up">
                  {en.credentials.capabilities.heading}
                </h2>
                <div className="d-grid skill-items gap-24 flex-wrap">
                  {en.credentials.capabilities.capabilities.map(
                    (item, index) => (
                      <div
                        className="skill-item"
                        data-aos="zoom-in"
                        key={index}
                      >
                        <span className="percent">{item.percent}</span>
                        <h3 className="name">{item.name}</h3>
                        <p>{item.description}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="skills-wrap awards-wrap">
                <h2 data-aos="fade-up">{en.credentials.expertise.heading}</h2>
                <div className="d-grid skill-items gap-24 flex-wrap">
                  {en.credentials.expertise.expertise.map((item, index) => (
                    <div className="skill-item" data-aos="zoom-in" key={index}>
                      <h3 className="name">{item.name}</h3>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CredentialsPage;
