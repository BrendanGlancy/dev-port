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
							<p>
								BuckeyeCTF 2021 - 23rd Place (Out of 300+ Teams)
							</p>
						<Progress multi>
							<Progress
								bar
								color="success"
								value="96"
								max="100"
							>
							</Progress>
						</Progress>
						<p>
							PicoCTF 2022 - 341st Place (Out of 18,000+ Participants)
						</p>
						<Progress multi>
						<Progress
							bar
							color="warning"
							value="93"
							max="100"
						>
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
