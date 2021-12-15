import React from "react";
import { Card, CardBody, Badge, Button } from "reactstrap";

import { Fade } from "react-reveal";

const EdutionCard = ({ education }) => {
	return (
		<Fade left duration={1000} distance="40px">
			<Card className="card-lift--hover shadow mt-4">
				<CardBody>
					<div className="d-flex px-3">
                        <div>
                          <div className="icon icon-shape bg-gradient-warning rounded-circle text-white">
                            <i className="ni ni-ruler-pencil" />
                          </div>
                        </div>
						<div className="pl-4">
							<h5 className="text-warning">
								{education.schoolName}
							</h5>
							<h6>{education.subHeader}</h6>
							<Badge color="warning" className="mr-1">
								{education.duration}
							</Badge>
							<p className="description mt-3">{education.desc}</p>
							<ul>
								{education.descBullets
									? education.descBullets.map((desc) => {
											return <li key={desc}>{desc}</li>;
									  })
									: null}
								<br></br>
								{education.github ? (
									<Button
										className="btn-icon"
										color="github"
										href={education.github}
										target="_blank"
										rel="noopener"
										aria-label="Github"
									>
										<span className="btn-inner--icon">
											<i className="fa fa-github" />
										</span>
									</Button>
								) : null}

							</ul>
						</div>
					</div>
				</CardBody>
			</Card>
		</Fade>
	);
};

export default EdutionCard;
