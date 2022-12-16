import React, { useState, useRef } from "reactn";
import { Link } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHomeLgAlt, faPaperPlane } from "@fortawesome/pro-solid-svg-icons";
import { toast } from "react-toastify";

import ContentBlock from "../../common/ContentBlock";
import AsyncTable from "../../common/AsyncTable";

const DetailsByLocationWidget = () => {
  const [showMsgModal, setShowMsgModal] = useState(null);
  const [msgData, setMsgData] = useState({ as: "sms", msg: "" });
  const asyncTableRef = useRef(null);
  const [tableData, setTableData] = useState(null);

  return (
    <>
      <ContentBlock
        title={
          <>
            <FontAwesomeIcon icon={faHomeLgAlt} /> Details By Location
          </>
        }
      >
        <AsyncTable
          asyncTableRef={asyncTableRef}
          cacheKey="dashboard-locations"
          endpoint="/dashboard/locations"
          columns={[
            {
              key: "name",
              header: "Location",
              sortable: true,
              render: (row) => {
                return <Link to={`/location/${row.id}`}>{row.name}</Link>;
              },
            },
            {
              key: "wtd",
              header: "WTD",
              sortable: true,
              render: (row) => {
                return (
                  <abbr
                    className={
                      row.wtdTrend < 0 ? "text-danger" : "text-success"
                    }
                  >
                    {row.wtd}
                  </abbr>
                );
              },
            },
            {
              key: "wtdTrend",
              header: "WTD Trend",
              sortable: true,
              render: (row) => {
                return (
                  <abbr
                    className={
                      row.wtdTrend < 0 ? "text-danger" : "text-success"
                    }
                  >
                    {row.wtdTrend}
                  </abbr>
                );
              },
            },
            {
              key: "mtd",
              header: "MTD",
              sortable: true,
              render: (row) => {
                return (
                  <abbr
                    className={
                      row.mtdTrend < 0 ? "text-danger" : "text-success"
                    }
                  >
                    {row.mtd}
                  </abbr>
                );
              },
            },
            {
              key: "mtdTrend",
              header: "MTD Trend",
              sortable: true,
              render: (row) => {
                return (
                  <abbr
                    className={
                      row.mtdTrend < 0 ? "text-danger" : "text-success"
                    }
                  >
                    {row.mtdTrend}
                  </abbr>
                );
              },
            },
            {
              key: "mtdForecast",
              header: "MTD Forecast",
              sortable: true,
              render: (row) => {
                return (
                  <abbr
                    className={
                      row.mtdForecast < 12 ? "text-danger" : "text-success"
                    }
                  >
                    {row.mtdForecast}
                  </abbr>
                );
              },
            },
            {
              key: "ytd",
              header: "YTD",
              sortable: true,
              render: (row) => {
                return (
                  <abbr
                    className={row.ytd < 50 ? "text-danger" : "text-success"}
                  >
                    {row.ytd}
                  </abbr>
                );
              },
            },
            {
              key: "conversion",
              header: "Conversion",
              sortable: true,
              render: (row) => {
                return (
                  <abbr
                    className={
                      row.conversion < 50 ? "text-danger" : "text-success"
                    }
                  >
                    {row.conversion}%
                  </abbr>
                );
              },
            },
            {
              key: "los",
              header: "LOS",
              sortable: true,
              render: (row) => {
                return (
                  <abbr
                    className={row.los < 20 ? "text-danger" : "text-success"}
                  >
                    {row.los}
                  </abbr>
                );
              },
            },
            {
              key: "numReps",
              header: "Sales Reps",
              sortable: true,
            },
          ]}
          sortBy="location"
          sortDir="ASC"
          onDataLoad={(data) => setTableData(data)}
          rowActions={[
            {
              label: "Message Manager",
              onClick: () => setShowMsgModal(1),
            },
            {
              label: "Message Team",
              onClick: () => setShowMsgModal(2),
            },
            { divider: true },
            {
              label: "Watch",
              onClick: () => alert("Test"),
            },
          ]}
        />
      </ContentBlock>
      <Modal show={showMsgModal !== null} onHide={() => setShowMsgModal(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Send A Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={() => alert("Message sent!")}>
            <Form.Group>
              <Form.Label>Send The Message To</Form.Label>
              <Form.Check
                name="to"
                type="radio"
                label="Another Location's Manager - Rhonda Simms"
                id="to-1"
                checked={showMsgModal === 1}
                onChange={(e) => setShowMsgModal(1)}
              />
              <Form.Check
                name="to"
                type="radio"
                label="Another Location's Entire Team"
                id="to-2"
                checked={showMsgModal === 2}
                onChange={(e) => setShowMsgModal(2)}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Send Via</Form.Label>
              <Form.Check
                name="as"
                type="radio"
                label="SMS/Text Message"
                id="as-sms"
                checked={msgData.as === "sms"}
                onChange={(e) => setMsgData({ ...msgData, as: "sms" })}
              />
              <Form.Check
                name="as"
                type="radio"
                label="Email"
                id="as-email"
                checked={msgData.as === "email"}
                onChange={(e) => setMsgData({ ...msgData, as: "email" })}
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Your Message</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                onChange={(e) =>
                  setMsgData({ ...msgData, msg: e.target.value })
                }
                maxLength={msgData.as === "sms" ? 250 : 2000}
              />
              {msgData.as === "sms" ? (
                <small className="text-muted">
                  {msgData.msg.length}/250 characters
                </small>
              ) : null}
            </Form.Group>
            <hr />
            <Button
              variant="success"
              onClick={() => {
                toast.success("Your message has been successfully sent!");
                setShowMsgModal(null);
                setMsgData({ ...msgData, msg: "" });
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} /> Send
            </Button>{" "}
            <Button variant="link" onClick={() => setShowMsgModal(null)}>
              Cancel
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DetailsByLocationWidget;
