import React, { useGlobal, useState, useEffect } from "reactn";
import moment from "moment-timezone";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCog,
  faSpinnerThird,
} from "@fortawesome/pro-solid-svg-icons";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { toast } from "react-toastify";

import MainLayout from "../layout/MainLayout";
import ScheduleItemModal from "./ScheduleItemModal";
import ScheduleModal from "../common/ScheduleModal";
import ContentBlock from "../common/ContentBlock";
import UserSelect from "../common/forms/UserSelect";
import OrgSelect from "../common/forms/OrgSelect";
import { makeRequest, createUrl } from "../../hooks/useApi";
import { useFormData } from "../../hooks/useFormData";

const Calendar = () => {
  const [user] = useGlobal("user");
  const [events, setEvents] = useState([]);
  const { formData, setData } = useFormData({
    startDate: null,
    endDate: null,
    users: [],
    org: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState(null);
  const [showScheduleItem, setShowScheduleItem] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(null);

  const loadCalendarData = () => {
    if (!formData.startDate) {
      return;
    }

    setIsLoading(true);

    (async () => {
      let res;
      let params = { startDate: formData.startDate, endDate: formData.endDate };

      if (formData.users.length > 0) {
        params.userIds = formData.users.map((u) => u.value).join(",");
      }

      if (formData.org) {
        params.orgId = formData.org.value;
      }

      if (params.userIds || params.orgId) {
        params.scoped = "0"
      }

      try {
        res = await makeRequest("GET", createUrl("/schedule/calendar", params));
        setRows(res.rows);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
        setRows(res.rows);
      }
    })();
  }
  /* Put in useEffect instead of using the normal useApiGet so that
  the query doesn't run twice at load time */
  useEffect(() => {
    loadCalendarData();
  }, [formData]);

  useEffect(() => {
    if (!rows) {
      return;
    }

    const eventData = [];

    rows.forEach((row) => {
      row._dates.forEach((dt) => {
        const format = moment(dt).format("YYYY-MM-DD");

        eventData.push({
          id: `${row.schedule_id}::${format}`,
          start: format,
          title:
            row.user_id !== user.user_id
              ? `${row.referral_source_name} // ${row.user_name}`
              : row.referral_source_name,
          editable: false,
          allDay: true,
          display: "list-item",
          textColor: row.user_id !== user.user_id ? "#ccc" : "#000",
          owner: row.user_id === user.user_id
        });
      });
    });

    setEvents(eventData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);
  return (
    <MainLayout>
      <ContentBlock
        title="Calendar"
        titleRight={
          <>
            {isLoading ? (
              <span className="me-3">
                <FontAwesomeIcon icon={faSpinnerThird} spin={true} /> Loading...
              </span>
            ) : null}
            <Button
              className="btn-white"
              size="sm"
              onClick={() => setShowScheduleForm({})}
            >
              <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> New Schedule
            </Button>
            <Button
              className="btn-white"
              size="sm"
              style={{ marginLeft: "0.5rem" }}
              onClick={() => alert("TEST")}
            >
              <FontAwesomeIcon icon={faCog} fixedWidth={true} />
            </Button>
          </>
        }
      >
        <Row>
          <Col>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                start: "prev,next today",
                center: "title",
                end: "dayGridMonth,dayGridWeek,dayGridDay",
              }}
              events={events}
              eventClick={(event) => {
                const id = event.event.id.split("::")[0];
                const dateStr = event.event.startStr;
                setShowScheduleItem({
                  id,
                  owner: event.event.extendedProps.owner,
                  date: dateStr
                });
              }}
              datesSet={({ view }) => {
                setData(
                  {
                    startDate: moment(view.activeStart).format("YYYY-MM-DD"),
                    endDate: moment(view.activeEnd).format("YYYY-MM-DD"),
                  },
                  true
                );
              }}
            />
          </Col>
          {user.role_name != 'rep' && (
            <Col sm={4} md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Organization</Form.Label>
                <OrgSelect
                  value={formData.org}
                  onChange={(val) => setData({ org: val }, true)}
                  isMulti={false}
                  scoped={true}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Users</Form.Label>
                <UserSelect
                  value={formData.users}
                  onChange={(vals) => setData({ users: vals }, true)}
                  isMulti={true}
                />
              </Form.Group>
            </Col>
          )}
        </Row>
      </ContentBlock>
      
      {showScheduleItem && (
        <ScheduleItemModal
          owner={showScheduleItem && showScheduleItem.owner}
          onEdit={(v) => {
            setShowScheduleItem(null);
            setShowScheduleForm(v);
          }}
          show={showScheduleItem !== null}
          toggle={() => setShowScheduleItem(null)}
          onNeedReload={() => {
            loadCalendarData()
          }}
          scheduleId={showScheduleItem && showScheduleItem.id}
          selectedDate={showScheduleItem && showScheduleItem.date}
        />
      )}
      <ScheduleModal
        show={showScheduleForm !== null}
        scheduleId={showScheduleForm && showScheduleForm.schedule_id}
        onSuccess={() => {
          loadCalendarData();
          setShowScheduleForm(null);
        }}
        toggle={() => setShowScheduleForm(null)}
      />
    </MainLayout>
  );
};

export default Calendar;
