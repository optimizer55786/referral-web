import React, { useEffect, useState } from "reactn";
import PropTypes from "prop-types";
import { Modal, Row, Col, Table } from "react-bootstrap";
import { LineChart, BarChart } from "react-chartkick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faSignalStream,
} from "@fortawesome/pro-solid-svg-icons";

import SmallCard from "../common/SmallCard";
import useQuantum from "../../hooks/useQuantum";

const allData = {
  users: {
    type: "bar",
    data: [
      {
        name: "Referrals MTD By User",
        data: {
          "Samuel Arnold": 25,
          "Jenny Smith": 22,
          "Misty Armstrong": 19,
          "Joseph Lucas": 17,
          "Ida Cruz": 17,
          "Will Humphreys": 15,
          "Heather Wilks": 12,
        },
      },
    ],
  },
  census: {
    type: "line",
    data: [
      {
        name: "Census By Month",
        data: {
          January: 23,
          February: 28,
          March: 36,
          April: 27,
          May: 32,
          June: 30,
          July: 25,
          August: 21,
          September: 10,
        },
      },
    ],
  },
  censusByLocation: {
    type: "line",
    data: [
      {
        name: "Sample Location",
        data: {
          January: 14,
          February: 18,
          March: 22,
          April: 19,
          May: 26,
          June: 18,
          July: 16,
          August: 11,
          September: 8,
        },
      },
      {
        name: "Another Location",
        data: {
          January: 9,
          February: 10,
          March: 14,
          April: 8,
          May: 6,
          June: 12,
          July: 9,
          August: 10,
          September: 2,
        },
      },
    ],
  },
  compareToBudget: {
    type: "line",
    data: [
      {
        name: "Sample Location",
        data: {
          January: 14,
          February: 18,
          March: 22,
          April: 19,
          May: 26,
          June: 18,
          July: 16,
          August: 11,
          September: 8,
        },
      },
      {
        name: "Sample Location Budget",
        data: {
          January: 12,
          February: 12,
          March: 12,
          April: 12,
          May: 12,
          June: 12,
          July: 12,
          August: 12,
          September: 12,
        },
      },
      {
        name: "Another Location",
        data: {
          January: 9,
          February: 10,
          March: 14,
          April: 8,
          May: 6,
          June: 12,
          July: 9,
          August: 10,
          September: 2,
        },
      },
      {
        name: "Another Location Budget",
        data: {
          January: 8,
          February: 8,
          March: 8,
          April: 8,
          May: 8,
          June: 8,
          July: 8,
          August: 8,
          September: 8,
        },
      },
    ],
  },
};

const QuantumModal = ({ show, onHide, question }) => {
  const [chartData, setChartData] = useState(allData.census);
  const { ask } = useQuantum();

  useEffect(() => {
    switch (question) {
      case "show me referrals month to date by user":
        setChartData(allData.users);
        break;

      case "Average daily census year to date by month":
        setChartData(allData.census);
        break;
      case "Average daily census year to date by month by location":
        setChartData(allData.censusByLocation);
        break;
      case "Average daily census year to date by month by location compare to budget":
        setChartData(allData.compareToBudget);
        break;
      default:
        setChartData(allData.census);
    }
  }, [question]);

  const renderBarChart = () => {
    let total = 0;
    const names = Object.keys(chartData.data[0].data);
    const values = chartData.data[0].data;

    return (
      <>
        <BarChart data={chartData.data} legend="bottom" height={350} />
        <hr />
        <Table striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Referrals</th>
            </tr>
          </thead>
          <tbody>
            {names.map((name, i) => {
              total += values[name];
              return (
                <tr key={i}>
                  <td>{name}</td>
                  <td>{values[name]}</td>
                </tr>
              );
            })}
            <tr>
              <td className="text-end">
                <strong>TOTAL</strong>
              </td>
              <td>{total}</td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  };

  const renderLineChart = () => {
    return (
      <>
        <LineChart data={chartData.data} legend="bottom" height={350} />
        <hr />
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>January</th>
              <th>February</th>
              <th>March</th>
              <th>April</th>
              <th>May</th>
              <th>June</th>
              <th>July</th>
              <th>August</th>
              <th>September</th>
            </tr>
          </thead>
          <tbody>
            {chartData.data.map((row, i) => {
              return (
                <tr key={i}>
                  <td>{row.name}</td>
                  {Object.values(row.data).map((v, n) => {
                    return <td key={n}>{v}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  };

  const renderLookDeeper = () => {
    if (chartData && chartData.type === "bar") {
      return null;
    }

    return question.indexOf("compare") > -1 ? null : (
      <>
        <h5 className="mb-3">Look Deeper:</h5>
        {question.indexOf("location") > -1 ? null : (
          <SmallCard onClick={() => ask(`${question} by location`)}>
            <p>
              <FontAwesomeIcon
                icon={faChevronRight}
                fixedWidth={true}
                style={{ color: "#d8e2ef" }}
              />{" "}
              By locations
            </p>
          </SmallCard>
        )}
        <SmallCard onClick={() => ask(`${question} compare to budget`)}>
          <p>
            <FontAwesomeIcon
              icon={faChevronRight}
              fixedWidth={true}
              style={{ color: "#d8e2ef" }}
            />{" "}
            Compare to location budgets
          </p>
        </SmallCard>
      </>
    );
  };

  if (!show) {
    return null;
  }

  return (
    <Modal show={show} fullscreen={true} onHide={() => onHide()}>
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faSignalStream} fixedWidth={true} /> Quantum
          Intelligence
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12} sm={3}>
            <h5 className="mb-3">Question:</h5>
            <p style={{ fontWeight: 700 }}>{question}</p>
            <hr />

            {renderLookDeeper()}
          </Col>
          <Col>
            {chartData.type === "bar" ? renderBarChart() : renderLineChart()}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

QuantumModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
};

export default QuantumModal;
