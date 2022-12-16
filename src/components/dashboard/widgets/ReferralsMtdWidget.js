import React from "reactn";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDotCircle } from "@fortawesome/pro-solid-svg-icons";
import { PieChart } from "react-chartkick";
import "chartkick/chart.js";

import ContentBlock from "../../common/ContentBlock";

const ReferralsMtdWidget = ({ data }) => {
  const total =
    data.referralMTD.Admit +
    data.referralMTD.Nonadmit +
    data.referralMTD.Discharge +
    data.referralMTD.Pending;
  const referralInfo = [
    { label: "Admit", color: "#2c7be5" },
    { label: "Nonadmit", color: "red" },
    { label: "Discharge", color: "orange" },
    { label: "Pending", color: "#ccc" },
  ];

  if (total === 0) {
    return (
      <ContentBlock>
        <h5 className="mb-3">Referrals MTD</h5>
        <p className="lead text-center">No data available.</p>
      </ContentBlock>
    );
  }

  return (
    <ContentBlock>
      <Row>
        <Col xs={12} sm={6}>
          <h5 className="mb-3">Referrals MTD</h5>
          <table style={{ width: "100%" }}>
            <thead></thead>
            <tbody>
              {referralInfo.map((info, key) => (
                <tr key={key}>
                  <td>
                    <span style={{ color: info.color }}>
                      <FontAwesomeIcon icon={faDotCircle} />
                    </span>{" "}
                    {info.label}
                  </td>
                  <td className="text-end">{data.referralMTD[info.label]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
        <Col xs={12} sm={6}>
          <PieChart
            data={{
              Admit: data.referralMTD.Admit,
              Nonadmit: data.referralMTD.Nonadmit,
              Discharge: data.referralMTD.Discharge,
              Pending: data.referralMTD.Pending,
            }}
            donut={true}
            legend={false}
            height={150}
            colors={referralInfo.map((info) => info.color)}
          />
        </Col>
      </Row>
    </ContentBlock>
  );
};

export default ReferralsMtdWidget;
