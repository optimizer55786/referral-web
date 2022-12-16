import React, { useState } from "reactn";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import Calendar from "react-calendar";
import moment from "moment-timezone";
import { useQueryClient } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faEdit,
  faTrash,
} from "@fortawesome/pro-regular-svg-icons";
import { toast } from "react-toastify";

import Loading from "../common/Loading";
import { useApiGet, useApiWriteDynamic } from "../../hooks/useApi";
import { capitalizeWords, nl2br } from "../../lib/stringHelpers";

import "react-calendar/dist/Calendar.css";
import "./css/ScheduleItemModal.css";

const TwoDigit = (num) => {
  if (num < 10)
    return `0${num}`;
  return num;
}
const ScheduleItemModal = ({ scheduleId, owner, show, toggle, onNeedReload, selectedDate, onEdit }) => {
  const { isLoading, isFetching, data } = useApiGet(
    `schedule-${scheduleId}?selectedDate=${selectedDate}`,
    `/schedule/${scheduleId}?selectedDate=${selectedDate}`,
    null,
    {
      staleTime: 1000,
    }
  );

  const apiDelete = useApiWriteDynamic(
    "delete",
    () => {
      toast.success("Your schedule item has been successfully deleted.");
      onNeedReload();
    },
    {
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  const renderContent = () => {
    if (isLoading || isFetching) {
      return <Loading />;
    }
    if (!data) {
      return (
        <div className="text-muted text-center">
          <FontAwesomeIcon icon={faCalendarDay} />
          <p>Your schedule is currently empty.</p>
        </div>
      );
    }
    let calendarRange = null;
    if (data._calendar && data._calendar.length >= 2) {
      calendarRange = [data._calendar[0], data._calendar.reverse()[0]];
    }

    return (
      <div style={{ paddingBottom: "3.5rem" }}>
        <hr />
        <Calendar
          onChange={() => {
            // do nothing
          }}
          tileClassName={({date, view}) => {
            const calendarDateRange = data._calendar.map(dt => moment(dt).format("YYYY-MM-DD"));
            const dateStr = `${date.getFullYear()}-${TwoDigit(date.getMonth() + 1)}-${TwoDigit(date.getDate())}`;
            if(view === "month" && selectedDate === dateStr) {
              return `react-calendar__tile--selected`;
            } else if(view === 'month' && (calendarDateRange || []).includes(dateStr)) 
              return `react-calendar__tile--hasActive`;
            else {
              return "react-calendar__tile--inactive";
            }
          }}
          value={
            calendarRange !== null
              ? calendarRange.map((dt) => moment(dt).toDate())
              : data._calendar.length === 1
                ? moment(data._calendar[0]).toDate()
                : null
          }
          selectRange={false}
          maxDetail="month"
          minDetail="month"
          showNavigation={false}
        />
        <br />

        <Form.Group>
          <Form.Label>Referral Source</Form.Label>
          <p>
            <Link to={`/referral-sources/${data.referral_source_id}`}>
              {data.referral_source_name}
            </Link>
          </p>
        </Form.Group>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <p>{moment(data.schedule_start_date).format("MM/DD/YYYY")}</p>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <p>
                {data.schedule_end_date
                  ? moment(data.schedule_end_date).format("MM/DD/YYYY")
                  : "None"}
              </p>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group>
          <Form.Label>Recurring</Form.Label>
          <p>{capitalizeWords(data._schedule_text)}</p>
        </Form.Group>

        <Form.Group>
          <Form.Label>Details</Form.Label>
          <p>{nl2br(data.schedule_details)}</p>
        </Form.Group>
      </div>
    );
  };

  return (    
    <Modal show={show} onHide={toggle}>
      <Modal.Header closeButton={true}>
        <Modal.Title>Schedule Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {renderContent()}      
      </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => onEdit(data)}
          >
            <FontAwesomeIcon icon={faEdit} fixedWidth={true} /> Edit
          </Button>          
          {owner && (
            <Button
              variant="danger"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this schedule item?"
                  )
                ) {
                  apiDelete.mutate(`/schedule/${scheduleId}`);
                  toggle();
                }
              }}
            >
              <FontAwesomeIcon icon={faTrash} fixedWidth={true} /> Delete
            </Button>
          )}
        </Modal.Footer>
    </Modal>
  );
};

ScheduleItemModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  scheduleId: PropTypes.string,
  owner: PropTypes.bool.isRequired,
  selectedDate: PropTypes.string.isRequired,
  onNeedReload: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default ScheduleItemModal;
