import React, {useState} from "react";

import { Card, InputGroup, InputGroupAddon, InputGroupText, Input, Button, CardBody, FormGroup, Col, Row, Container } from "reactstrap";
import SocialLinks from "../components/SocialLinks";
import Image from "next/image";
import classnames from "classnames";


const GithubProfileCard = ({ prof }) => {
	const state = useState("");
	return (
		<Card className="section-xl bg-gradient-info shadow-lg border-10">
			<Container className="">
				<div className="p-2">
					<Row className="">
						<Col className="order-lg-2" lg="4">
							<img
								src={prof.avatar_url}
								style={{ width: "200px" }}
								alt=""
								className="rounded-circle img-center img-fluid shadow shadow-lg--hover mb-4"
							/>
						</Col>
						<Col lg="8" className="order-lg-1">
							<h2 className="text-white">Reach Out to me!</h2>
							<p className="lead text-white mt-3">
								DISCUSS A PROJECT OR JUST WANT TO SAY HI? MY
								INBOX IS OPEN FOR ALL
							</p>
							<p className="text-white mt-3">{prof.bio}</p>
							<div className="my-3 icon-shape bg-gradient-white shadow rounded text-info">
								<i className="ni ni-pin-3 text-info mr-2" />
								{prof.location}
							</div>
							<SocialLinks />
						</Col>
					</Row>
				</div>
			</Container>
		</Card>
	);
};

export default GithubProfileCard;
