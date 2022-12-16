import React, { useGlobal, useState, useDispatch } from "reactn";
import {
  Row,
  Col,
  Form,
  Button,
  OverlayTrigger,
  Popover,
  Card
} from "react-bootstrap";
import moment from "moment-timezone";
import merge from "lodash.merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/pro-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import MainLayout from "../layout/MainLayout";
import ContentBlock from "../common/ContentBlock";
import AsyncTable from "../common/AsyncTable";
import OrgSelect from "../common/forms/OrgSelect";
import UserSelect from "../common/forms/UserSelect";
import { useFormData } from "../../hooks/useFormData";
import referralsGridProps from "./referralsGridProps";

const Referrals = () => {
  const [selectedBusinessLineId] = useGlobal("selectedBusinessLineId");

  const defaultDateRange = [
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ];
  const defaultVals = {
    businessLine: selectedBusinessLineId,
    patient_name: "",
    org: null,
    user: null,
    referral_status: "",
    dateOption: "",
    dateRange: defaultDateRange,
  };
  const { formData, onChange, setData } = useFormData(defaultVals);
  
  const [referralsView] = useGlobal('referralsView');
  const updateReferralsView = useDispatch("updateReferralsView");
  const [tableColumns, setTableColumns] = useState(merge(referralsView,referralsGridProps.columns))
  const getFilters = (formData) => {
    const filters = {
      businessLine: selectedBusinessLineId,
      status: formData.referral_status,
    };

    if (formData.user) {
      filters.user_id = formData.user.value;
    }

    if (formData.org) {
      filters.org_id = formData.org.value;
    }

    if (formData.dateOption !== "") {
      filters.date_option = formData.dateOption;
      filters.start_date = formData.dateRange[0].startDate;
      filters.end_Date = formData.dateRange[0].endDate;
    }

    return filters;
  };

  const [filters, setFilters] = useState(getFilters(defaultVals));

  const options = [
    { name: "Start Of Care Date", value: "start_of_care_date" },
    { name: "Referral Date", value: "referral_date" },
    { name: "Nonadmit Date", value: "nonadmit_date" },
  ];

  const onSubmit = (e) => {
    e.preventDefault();
    setFilters(getFilters(formData));
  };

  const DateFilterPopover = (
    <Popover
      id="popover-datefilter"
      style={{ width: "auto", maxWidth: "none" }}
    >
      <Popover.Header>Select date</Popover.Header>
      <Popover.Body>
        <Form.Group>
          <Form.Label>Select date type</Form.Label>
          <br />
          {options.map((option, idx) => (
            <Form.Check
              key={idx}
              id={`option-${idx}`}
              label={option.name}
              type="radio"
              name="dateOption"
              checked={formData.dateOption === option.value}
              onChange={(e) =>
                onChange({
                  target: { name: "dateOption", value: option.value },
                })
              }
              inline
            />
          ))}
        </Form.Group>
        <div className="d-flex justify-content-center mt-4">
          <DateRangePicker
            onChange={(item) =>
              onChange({
                target: { name: "dateRange", value: [item.selection] },
              })
            }
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={formData.dateRange}
            direction="vertical"
            scroll={{ enabled: true }}
          />
        </div>
      </Popover.Body>
    </Popover>
  );

  const displayDateFilter = () => {
    const startDate = moment
      .utc(formData.dateRange[0].startDate)
      .format("YYYY-MM-DD");
    const endDate = moment
      .utc(formData.dateRange[0].endDate)
      .format("YYYY-MM-DD");
    const dateOption = formData.dateOption.replaceAll("_", " ");
    return `${dateOption} (${startDate} ~ ${endDate})`;
  };
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };
  const [showCustomViewPopover, setShowCustomViewPopover] = useState(false);
  const CustomViewPopover = (
    <Card
      id="popover-customview"
      style={{ top: "3.2rem", position: "absolute", right: "1.2rem", zIndex: 9999 }}
    >
      <Card.Header>Customize Columns</Card.Header>
      <Card.Body>
        <DragDropContext 
          onDragEnd={(result)=>{
            if (!result.destination) {
              return;
            }
            const items = reorder(
              tableColumns,
              result.source.index,
              result.destination.index
            );
            setTableColumns(items);
          }}
        >
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tableColumns.map((column, index) => (
                  <Draggable key={column.key} draggableId={column.key} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        
                      >
                        <Form.Check
                          type="checkbox"
                          id={`cb-column-${column.key}`}
                          label={column.header}
                          checked={column.visible}
                          onChange={(e) => {
                              let newColumn = Array.from(tableColumns);
                              newColumn[index].visible = !newColumn[index].visible ;
                              setTableColumns(newColumn)
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="d-flex align-items-center justify-content-between">
          <Button 
            variant="primary" 
            size="sm"
            onClick={()=>{
              let defaultColumn = referralsGridProps.columns.map((column)=>{return {key:column.key, visible:true}})
              let newColumn = Array.from(merge(defaultColumn,referralsGridProps.columns));
              setTableColumns(newColumn)
              updateReferralsView(defaultColumn)
            }}
          >
            Reset
          </Button>
          <Button 
            variant="success" 
            size="sm"
            onClick={()=>{
              updateReferralsView(tableColumns.map((column)=>{return {key:column.key, visible:column.visible}}))
            }}
          >
            Save
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
  return (
    <MainLayout>
      <ContentBlock
        title="Referrals"
        titleRight={
          <>
            <Button
              className="btn-white"
              size="sm"
              style={{ marginLeft: "0.5rem" }}
              onClick={() => setShowCustomViewPopover(!showCustomViewPopover)}
            >
              <FontAwesomeIcon icon={faCog} fixedWidth={true} />
            </Button>
            {showCustomViewPopover ? CustomViewPopover : null}
          </>
        }
      >
        <form onSubmit={onSubmit} className="mb-3">
          <Row>
            <Col xs={12} sm={6} md={2}>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="search"
                name="patient_name"
                onChange={onChange}
                value={formData.patient_name}
                placeholder="Search..."
              />
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Label>Organization</Form.Label>
              <OrgSelect
                value={formData.org}
                onChange={(val) =>
                  onChange({ target: { name: "org", value: val } })
                }
                isMulti={false}
              />
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Label>User</Form.Label>
              <UserSelect
                value={formData.user}
                onChange={(val) =>
                  onChange({ target: { name: "user", value: val } })
                }
                isMulti={false}
              />
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="referral_status"
                onChange={onChange}
                value={formData.referral_status}
              >
                <option></option>
                <option value="admit">Admit</option>
                <option value="discharge">Discharge</option>
                <option value="pending">Pending</option>
                <option value="nonadmit">Non Admit</option>
              </Form.Select>
            </Col>
            <Col xs={12} sm={6} md={2}>
              <Form.Label>Date</Form.Label>
              <div>
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={DateFilterPopover}
                  rootClose
                >
                  <Button
                    variant="light"
                    className="text-capitalize"
                    style={{ whiteSpace: "break-spaces" }}
                  >
                    {formData.dateOption !== ""
                      ? displayDateFilter()
                      : "Select date"}
                  </Button>
                </OverlayTrigger>
              </div>
            </Col>
            <Col xs={12} sm={2}>
              <div className="text-end" style={{ marginTop: "32px" }}>
                <Button
                  variant="light"
                  className="me-2"
                  onClick={() => {
                    setData(defaultVals);
                    setFilters(getFilters(defaultVals));
                  }}
                >
                  Clear
                </Button>
                <Button type="submit" variant="primary">
                  Filter
                </Button>
              </div>
            </Col>
          </Row>
        </form>

        <AsyncTable
          cacheKey="referrals"
          endpoint="/referrals"
          filters={filters}
          sortBy="referral_date"
          sortDir="DESC"
          columns={tableColumns.filter(column=>column.visible === true)}
        />
      </ContentBlock>
    </MainLayout>
  );
};

export default Referrals;
