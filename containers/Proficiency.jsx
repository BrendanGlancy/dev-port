import React from "react";
import { SkillBars } from "../portfolio";
import { Container, Row, Progress, Col } from "reactstrap";

import { Fade } from "react-reveal";

import GreetingLottie from "../components/DisplayLottie";

const Proficiency = () => {
	return (
		<Container className="section section-lg">
			<Fade bottom duration={1000} distance="40px">
				<Row>
					<Col lg="6">
						<h1 className="h1">Competition Placements</h1>
						<p className="lead">
							PicoCTF 341st place out of 10,000+ teams
						</p>
						<Progress multi>
							<Progress
								bar
								color="success"
								value="96"
								max="100">
							</Progress>
						</Progress>
						<p className="lead">
							Buckeye CTF 23rd place out of 300+ teams
						</p>
						<Progress multi>
							<Progress
								bar
								value="93"
								color="warning"
								max="100">
							</Progress>
						</Progress>
					</Col>
					<Col lg="6">
						<GreetingLottie animationPath="/lottie/build.json" />
					</Col>
				</Row>
			</Fade>
		</Container>
	);
};

export default Proficiency;
