import React from "reactn";
import { Row, Col, Badge } from "react-bootstrap";
import { PieChart } from "react-chartkick";
import "chartkick/chart.js";

import ContentBlock from "../../common/ContentBlock";

const ConversionRatioMtdWidget = ({ data }) => {
  const total = data.referralMTD.Admit + data.referralMTD.Nonadmit;

  const admitRatio = (admit, nonadmit, digit) => {
    if (admit === 0) return 0;
    return ((admit / (admit + nonadmit)) * 100).toFixed(digit);
  };

  const referralRatio = () => {
    let referralRatio =
      admitRatio(data.referralMTD.Admit, data.referralMTD.Nonadmit, 2) -
      admitRatio(data.referralPrevMTD.Admit, data.referralPrevMTD.Nonadmit, 2);
    return (referralRatio > 0 ? "+" : "") + referralRatio;
  };

  if (total === 0) {
    return (
      <ContentBlock>
        <h5 className="mb-3">Conversion Ratio MTD</h5>
        <p className="lead text-center">No data available.</p>
      </ContentBlock>
    );
  }

  return (
    <ContentBlock>
      <Row>
        <Col xs={12} sm={6}>
          <h5 className="mb-3">Conversion Ratio MTD</h5>
          <h1 style={{ color: "#2c7be5" }}>
            {admitRatio(data.referralMTD.Admit, data.referralMTD.Nonadmit, 0)}%{" "}
            <small style={{ fontSize: "1.15rem", color: "#999" }}>
              of {data.referralMTD.Admit + data.referralMTD.Nonadmit}
            </small>
          </h1>
          <Badge bg={referralRatio() > 0 ? "success" : "danger"}>
            {referralRatio()} %
          </Badge>
        </Col>
        <Col xs={12} sm={6}>
          <PieChart
            data={{
              Admit: data.referralMTD.Admit,
              Nonadmit: data.referralMTD.Nonadmit,
            }}
            donut={true}
            legend={false}
            height={150}
            colors={["#2c7be5", "red"]}
          />
        </Col>
      </Row>
    </ContentBlock>
  );
};

export default ConversionRatioMtdWidget;
