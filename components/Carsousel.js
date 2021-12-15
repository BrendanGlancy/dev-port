
import React from "react";

// reactstrap components
import { Button, Container, Row, Col, UncontrolledCarousel } from "reactstrap";

const items = [
  {
    src: require("../public/img/icons/common/img-1-.jpg"),
    altText: "",
    caption: "",
    header: ""
  },
  {
    src: require("../public/img/icons/common/img-2.jpg"),
    altText: "",
    caption: "",
    header: ""
  }
];

class Carousel extends React.Component {
  render() {
    return (
      <>
        <section className="section section-shaped">
          <div className="shape shape-style-1 shape-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container className="py-md">
            <Row className="justify-content-between align-items-center">
              <Col className="mb-5 mb-lg-0" lg="5">
                <h1 className="text-white font-weight-light">
                  Bootstrap carousel
                </h1>
                <p className="lead text-white mt-4">
                  Argon Design System comes with four pre-built pages to help
                  you get started faster. You can change the text and images and
                  you're good to go.
                </p>
                <Button
                  className="btn-white mt-4"
                  color="default"
                  href="https://demos.creative-tim.com/argon-design-system-react/#/documentation/alerts?ref=adsr-landing-page"
                >
                  See all components
                </Button>
              </Col>
              <Col className="mb-lg-auto" lg="6">
                  <UncontrolledCarousel items={items} />
              </Col>
            </Row>
          </Container>
          {/* SVG separator */}
          <div className="separator separator-bottom separator-skew">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="fill-white" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>
      </>
    );
  }
}

export default Carousel;
