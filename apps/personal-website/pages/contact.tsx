import { ValidationError, useForm } from '@formspree/react';
import { Layout } from '@brendanglancy/core-components';
import { en } from '@brendanglancy/i18n';
import { useEffect, useState } from 'react';
import { Alert, Form } from 'reactstrap';

const ContactPage = () => {
  // formspree.io/register get a code and chang the below
  const [state, handleSubmit] = useForm('xbjnwpob');
  const [displayBanner, setDisplayBanner] = useState(false);

  useEffect(() => {
    if (state.submitting) {
      setDisplayBanner(false);
    }
    if (state.succeeded) {
      setDisplayBanner(true);
    }
  }, [state]);

  return (
    <Layout wrapperClass="main-aboutpage">
      <section className="contact-area">
        <div className="container">
          <div className="gx-row d-flex justify-content-between gap-24">
            <div className="contact-infos">
              <h3 data-aos="fade-up">{en.contact.contact.heading}</h3>
              <ul className="contact-details">
                <li className="d-flex align-items-center" data-aos="zoom-in">
                  <div className="icon-box shadow-box">
                    <i className={en.contact.contact.mail.icon} />
                  </div>
                  <div className="right">
                    <span>{en.contact.contact.mail.heading}</span>
                    {en.contact.contact.mail.links.map((item, index) => (
                      <h4 key={index}>
                        <a href={`mailto:${item}`}>{item}</a>
                      </h4>
                    ))}
                  </div>
                </li>
                <li className="d-flex align-items-center" data-aos="zoom-in">
                  <div className="icon-box shadow-box">
                    <i className={en.contact.contact.phone.icon} />
                  </div>
                  <div className="right">
                    <span>{en.contact.contact.phone.heading}</span>
                    {en.contact.contact.phone.links.map((item, index) => (
                      <h4 key={index}>
                        <a href={item.href}>{item.text}</a>
                      </h4>
                    ))}
                  </div>
                </li>
                <li className="d-flex align-items-center" data-aos="zoom-in">
                  <div className="icon-box shadow-box">
                    <i className={en.contact.contact.location.icon} />
                  </div>
                  <div className="right">
                    <span>{en.contact.contact.location.heading}</span>
                    <h4>{en.contact.contact.location.location}</h4>
                  </div>
                </li>
              </ul>
              <h3 data-aos="fade-up">{en.contact.profiles.heading}</h3>
              <ul
                className="social-links d-flex align-center"
                data-aos="zoom-in"
              >
                <li>
                  <a
                    className="shadow-box"
                    href="https://github.com/brendanglancy"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <i className="iconoir-github" />
                  </a>
                </li>
                <li>
                  <a
                    className="shadow-box"
                    href="https://linkedin.com/in/brendan-glancy"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <i className="iconoir-linkedin" />
                  </a>
                </li>
              </ul>
            </div>
            <div data-aos="zoom-in" className="contact-form">
              <div className="shadow-box">
                <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                <img src="/assets/icons/icon3.png" alt="Icon" />
                <h1
                  dangerouslySetInnerHTML={{
                    __html: en.contact.form.heading,
                  }}
                ></h1>
                <Form onSubmit={handleSubmit}>
                  <Alert
                    className="messenger-box-contact__msg"
                    role="alert"
                    color="success"
                    isOpen={displayBanner}
                    toggle={() => setDisplayBanner(false)}
                  >
                    {en.contact.form.onCompletion}
                  </Alert>

                  <div className="input-group">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      placeholder="Name *"
                    />
                    <ValidationError
                      prefix="Name"
                      field="name"
                      errors={state.errors}
                    />
                  </div>
                  <div className="input-group">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="Email *"
                    />
                    <ValidationError
                      prefix="Email"
                      field="email"
                      errors={state.errors}
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      name="topic"
                      id="topic"
                      required
                      placeholder="Topic *"
                    />
                    <ValidationError
                      prefix="topic"
                      field="topic"
                      errors={state.errors}
                    />
                  </div>
                  <div className="input-group">
                    <textarea
                      name="message"
                      id="message"
                      required
                      placeholder="Message *"
                    />
                    <ValidationError
                      prefix="Message"
                      field="message"
                      errors={state.errors}
                    />
                  </div>
                  <div className="input-group">
                    <button
                      className="theme-btn submit-btn"
                      type="submit"
                      disabled={state.submitting}
                    >
                      {en.contact.form.button.text}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
