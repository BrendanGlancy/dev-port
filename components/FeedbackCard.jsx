import React from "react";
import { Card, CardBody, Badge } from "reactstrap";

import { Fade } from "react-reveal";

const FeedbackCard = ({ data }) => {
  return (
    <Fade left duration={1000} distance="40px">
      <Card className="card-lift--hover shadow mt-4">
        <CardBody>
          <div className="d-flex px-3">
            <div className="pl-3">
              <h4 className="text-primary">{data.name}</h4>
              <p className="description mt-3">{data.feedback}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </Fade>
  );
};

export default FeedbackCard;
