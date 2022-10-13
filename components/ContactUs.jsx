import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import classnames from "classnames";

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";


export const ContactUs = () => {
  const state = {};
  const componentDidMount = () => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_a9om1j9', 'template_ne6y26e', form.current, 'x1yCe-srHK2E4ZbxM')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  }

    return (
      <>
        <section className="section section-lg section-shaped">
          <div className="shape shape-style-2 shape-primary">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

      <form ref={form} onSubmit={sendEmail}>
              <Container>
                <Row className="justify-content-center">
                  <Col lg="8">
                    <Card className="bg-gradient-secondary shadow">
                      <CardBody className="p-lg-5">
                        <h4 className="mb-1">Want to work with me?</h4>
                        <p className="mt-0">
                          Your project is very important to me.
                        </p>
                          <FormGroup
                              className={classnames("mt-5", {

                              })}
                          >
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-user-run" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Your name"
                              type="text"
                            />
                          </InputGroup>
                        </FormGroup>
                          <FormGroup
                            className={classnames({
                            })}
                          >
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-email-83" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Email address"
                              type="email"
                            />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup className="mb-4">
                          <Input
                            className="form-control-alternative"
                            cols="80"
                            name="name"
                            placeholder="Type a message..."
                            rows="4"
                            type="textarea"
                          />
                        </FormGroup>
                        <div>
                          <Button
                            block
                            className="btn-round"
                            color="default"
                            size="lg"
                            type="submit"
                            onClick={sendEmail}
                          >
                            Send Message
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </form>
          </section>
      </>
    );
  }


export default ContactUs;
