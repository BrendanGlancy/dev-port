
import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";

// reactstrap components
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


class Landing extends React.Component {
  state = {};
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }
  render() {
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

                                })} onReset={this.handleFormReset}
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
                                  onFocus={e => this.setState({ nameFocused: true })}
                                  onBlur={e => this.setState({ nameFocused: false })}
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
                                  onFocus={e => this.setState({ emailFocused: true })}
                                  onBlur={e => this.setState({ emailFocused: false })}
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
                                onClick={() => window.location.reload(false)}
                              >
                                Send Message
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
              </section>
      </>
    );
  }
}

export default Landing;
