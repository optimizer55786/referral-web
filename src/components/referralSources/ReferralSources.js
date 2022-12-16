import React, { useState, useRef, useGlobal, useDispatch } from "reactn";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faCog,
  faTasks,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/pro-solid-svg-icons";
import { toast } from "react-toastify";
import merge from "lodash.merge";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import CmsExplorerModal from "../cms/CmsExplorerModal";
import MainLayout from "../layout/MainLayout";
import AsyncTable from "../common/AsyncTable";
import ContentBlock from "../common/ContentBlock";
import CustomDropdown from "../common/CustomDropdown";
import LoadingModal from "../common/LoadingModal";
import UserSelect from "../common/forms/UserSelect";
import { useFormData } from "../../hooks/useFormData";
import { useApiRequest, useApiPost } from "../../hooks/useApi";
import { useQueryClient } from "react-query";
import { isUserAssigned } from "../../lib/referralSourceHelpers";

import referralSourcesGridProps from "./referralSourcesGridProps";
import ReferralSourceAssignment from "./ReferralSourceAssignment";
import EditReferralSourceModal from "./profile/EditReferralSourceModal";

import TargetModal from "./profile/TargetModal";
import NewReferralSourceModal from "./profile/NewReferralSourceModal";
import ScheduleModal from "../common/ScheduleModal";

const getFilters = (formData) => {
  const filters = {};

  [
    "search",
    "referral_source_type",
    "referral_source_parent_name",
    "location",
    "referral_source_rating",
  ].forEach((k) => {
    if (formData[k] !== "") {
      filters[k] = formData[k];
    }
  });
  filters["assigned_user"] = formData["assigned_user"]?.value;
  filters["targeted_user"] = formData["targeted_user"]?.value;
  return filters;
};

const formDataDefaults = {
  search: "",
  referral_source_type: "",
  referral_source_rating: "",
  referral_source_parent_name: "",
  location: "",
  assigned_user: null,
  targeted_user: null,
};

const ReferralSources = () => {
  const asyncTableRef = useRef(null);
  const { formData, onChange, setData } = useFormData(formDataDefaults);
  const [filters, setFilters] = useState({ ...getFilters(formData) });
  const [showCms, setShowCms] = useState(false);
  const [checked, setChecked] = useState([]);
  const [tableData, setTableData] = useState(null);
  const [showAssign, setShowAssign] = useState(null);
  const [showEditReferralSourceModal, setShowEditReferralSourceModal] =
    useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(null);
  const [showNewReferralSourceModal, setShowNewReferralSourceModal] =
    useState(false);
  const [referralSourcesView] = useGlobal("referralSourcesView");
  const updateReferralSourcesView = useDispatch("updateReferralSourcesView");
  const [tableColumns, setTableColumns] = useState(
    merge(referralSourcesGridProps.columns, referralSourcesView)
  );
  const [expandFilters, setExpandFilters] = useState(false);
  const [showCustomViewPopover, setShowCustomViewPopover] = useState(false);
  const queryClient = useQueryClient();
  const [showTargetModal, setShowTargetModal] = useState(null);
  const [user] = useGlobal("user");
  const [selectedBusinessLineId] = useGlobal("selectedBusinessLineId");
  const onSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...getFilters(formData) });
  };
  const onClear = () => {
    setData(formDataDefaults);
    setFilters({});
  };

  const getAllIds = useApiRequest(
    (res) => {
      setShowAssign(res);
    },
    { onError: (err) => toast.error(err.message) }
  );

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const CustomViewPopover = (
    <Card
      id="popover-customview"
      style={{
        top: "3.2rem",
        position: "absolute",
        right: "1.2rem",
        zIndex: 9999,
      }}
    >
      <Card.Header>Customize Columns</Card.Header>
      <Card.Body>
        <DragDropContext
          onDragEnd={(result) => {
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
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tableColumns.map((column, index) => (
                  <Draggable
                    key={column.key}
                    draggableId={column.key}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      return (
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
                              newColumn[index].visible =
                                !newColumn[index].visible;
                              setTableColumns(newColumn);
                            }}
                          />
                        </div>
                      );
                    }}
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
            onClick={() => {
              let defaultColumn = referralSourcesGridProps.columns.map(
                (column) => {
                  return { key: column.key, visible: true };
                }
              );
              let newColumn = Array.from(
                merge(defaultColumn, referralSourcesGridProps.columns)
              );
              setTableColumns(newColumn);
              updateReferralSourcesView(defaultColumn);
            }}
          >
            Reset
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => {
              let sTableColumns = Array.from(tableColumns);
              updateReferralSourcesView(
                sTableColumns.map((column) => {
                  return { key: column.key, visible: column.visible };
                })
              );
            }}
          >
            Save
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const targetReferralSourcesApi = useApiPost(
    "/referral-sources/target",
    (resp) => {
      toast.success("Referral Source is targeted successfully!");
      queryClient.invalidateQueries();
    },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const targetAllIds = useApiRequest(
    (res) => {
      if (user.role_name === "rep") {
        targetReferralSourcesApi.mutate({
          referralSourceIds: res,
          removeExisting: true,
          businessLineId: selectedBusinessLineId,
        });
      } else {
        setShowTargetModal(res);
      }
    },
    { onError: (err) => toast.error(err.message) }
  );
  return (
    <MainLayout>
      <ContentBlock
        title="Referral Sources"
        titleRight={
          <>
            {checked.length > 0 ? (
              <CustomDropdown
                menuItems={[
                  {
                    label: "Assign Selected",
                    onClick: () => {
                      if (
                        checked.includes("_all") &&
                        tableData.totalCount > tableData.returnedCount
                      ) {
                        const url = `${asyncTableRef.current.getQueryUrl()}&idsOnly=1`;
                        getAllIds.mutate({ url, method: "get" });
                      } else if (checked.includes("_all")) {
                        setShowAssign(
                          tableData.rows.map((r) => r.referral_source_id)
                        );
                      } else {
                        setShowAssign(checked);
                      }
                    },
                  },
                  {
                    label: "Target Selected",
                    onClick: () => {
                      if (
                        checked.includes("_all") &&
                        tableData.totalCount > tableData.returnedCount
                      ) {
                        const url = `${asyncTableRef.current.getQueryUrl()}&idsOnly=1`;
                        targetAllIds.mutate({ url, method: "get" });
                      } else if (checked.includes("_all")) {
                        if (user.role_name === "rep") {
                          targetReferralSourcesApi.mutate({
                            referralSourceIds: tableData.rows.map(
                              (r) => r.referral_source_id
                            ),
                            removeExisting: true,
                            businessLineId: selectedBusinessLineId,
                          });
                        } else {
                          setShowTargetModal(
                            tableData.rows.map((r) => r.referral_source_id)
                          );
                        }
                      } else {
                        if (user.role_name === "rep") {
                          targetReferralSourcesApi.mutate({
                            referralSourceIds: checked,
                            removeExisting: true,
                            businessLineId: selectedBusinessLineId,
                          });
                        } else {
                          setShowTargetModal(checked);
                        }
                      }
                    },
                  },
                ]}
                label="Bulk Actions"
                icon={faTasks}
                className="me-2 btn-white"
              >
                Bulk Actions
              </CustomDropdown>
            ) : null}
            <Button
              className="btn-white"
              size="sm"
              onClick={() => setShowNewReferralSourceModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> New Contact
            </Button>
            <Button
              className="btn-white"
              size="sm"
              style={{ marginLeft: "0.5rem" }}
              onClick={() => setShowCms(true)}
            >
              <FontAwesomeIcon icon={faSearch} fixedWidth={true} /> Add
              Facility/Provider
            </Button>
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
            <Col>
              <Form.Group>
                <Form.Label>Search Name</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  value={formData.search}
                  onChange={onChange}
                  placeholder="Search..."
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="referral_source_type"
                  value={formData.referral_source_type}
                  onChange={onChange}
                >
                  <option value="">All</option>
                  <option value="facility">Facility</option>
                  <option value="provider">Provider</option>
                  <option value="contact">Contact</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={onChange}
                  placeholder="Location"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Assigned To</Form.Label>
                <UserSelect
                  value={formData.assigned_user}
                  onChange={(val) =>
                    onChange({ target: { name: "assigned_user", value: val } })
                  }
                  isMulti={false}
                  placeholder="Assigned User"
                  showDefaultOptions={true}
                />
              </Form.Group>
            </Col>
            <Col className="text-end" style={{ paddingTop: 32 }}>
              <Button
                variant="link"
                onClick={() => setExpandFilters(!expandFilters)}
                className="me-2"
              >
                <FontAwesomeIcon
                  icon={expandFilters ? faChevronUp : faChevronDown}
                  fixedWidth={true}
                />{" "}
                More
              </Button>
              <Button
                variant="light"
                onClick={() => onClear()}
                className="me-2"
              >
                Clear
              </Button>
              <Button type="submit" variant="primary">
                Filter
              </Button>
            </Col>
          </Row>

          <Row className={`mt-3 ${!expandFilters ? "d-none" : ""}`}>
            <Col sm={3}>
              <Form.Group>
                <Form.Label>Parent Name</Form.Label>
                <Form.Control
                  type="text"
                  name="referral_source_parent_name"
                  value={formData.referral_source_parent_name}
                  onChange={onChange}
                  placeholder="Parent Name"
                />
              </Form.Group>
            </Col>
            {user.role_name !== "rep" && (
              <Col sm={3}>
                <Form.Group>
                  <Form.Label>Targeted To</Form.Label>
                  <UserSelect
                    value={formData.targeted_user}
                    onChange={(val) =>
                      onChange({
                        target: { name: "targeted_user", value: val },
                      })
                    }
                    isMulti={false}
                    placeholder="Targeted User"
                  />
                </Form.Group>
              </Col>
            )}
            <Col sm={3}>
              <Form.Group>
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  name="referral_source_rating"
                  value={formData.referral_source_rating}
                  onChange={onChange}
                >
                  <option value="">All</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="null">null</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </form>

        <AsyncTable
          asyncTableRef={asyncTableRef}
          cacheKey="referral-sources"
          endpoint="/referral-sources"
          columns={tableColumns.filter((column) => column.visible === true)}
          checkboxKey="referral_source_id"
          sortBy="referral_source_name"
          sortDir="ASC"
          filters={filters}
          onDataLoad={(data) => setTableData(data)}
          onCheckedChange={(checked) => setChecked(checked)}
          rowActions={[
            {
              label: "Assign",
              roles: [],
              onClick: (row) => {
                if (user.role_name === "rep" && row._assigned_users.length) {
                  if (isUserAssigned(row) === true) {
                    toast.error(
                      "You do not have the required permissions to assign this referral source."
                    );
                    return;
                  }
                }
                setShowAssign([row.referral_source_id]);
              },
            },
            {
              label: "Edit",
              roles: [],
              onClick: (row) => {
                if(user.role_name === 'manager') {
                  row = {...row, isManager: true}
                  setShowEditReferralSourceModal(row);
                } else setShowEditReferralSourceModal(row);
              },
            },
            {
              label: "Schedule",
              roles: [],
              onClick: (row) => setShowScheduleModal(row),
            },
            {
              label: "Map",
              roles: [],
              onClick: (row) => toast.info("MAP"),
            },
            {
              label: "Toggle Target",
              roles: [],
              onClick: (row) => {
                if (user.role_name !== "rep") {
                  setShowTargetModal([row.referral_source_id]);
                } else {
                  targetReferralSourcesApi.mutate({
                    referralSourceIds: [row.referral_source_id],
                    removeExisting: true,
                    businessLineId: selectedBusinessLineId,
                  });
                }
              },
              isVisible: (row) => {
                if (user.role_name !== "rep") {
                  return true;
                } else {
                  return !row._assigned_users.filter(
                    (u) => u.user_id === user.user_id
                  ).length
                    ? false
                    : true;
                }
              },
            },
          ]}
        />
      </ContentBlock>

      <CmsExplorerModal show={showCms} toggle={() => setShowCms(false)} />
      <LoadingModal
        show={getAllIds.isLoading}
        toggle={() => {}}
        msg="Getting referral sources..."
      />
      <ReferralSourceAssignment
        show={showAssign !== null}
        toggle={() => setShowAssign(null)}
        referralSourceIds={showAssign || []}
        onSuccess={() => queryClient.invalidateQueries()}
      />
      <EditReferralSourceModal
        show={showEditReferralSourceModal !== null}
        toggle={() => setShowEditReferralSourceModal(null)}
        referralSource={showEditReferralSourceModal}
        onSuccess={() => queryClient.invalidateQueries()}
      />
      <ScheduleModal
        show={showScheduleModal !== null}
        toggle={() => setShowScheduleModal(null)}
        referralSource={showScheduleModal}
        onSuccess={() => queryClient.invalidateQueries()}
      />
      <TargetModal
        show={showTargetModal !== null}
        toggle={() => setShowTargetModal(null)}
        referralSourceIds={showTargetModal || []}
        onSuccess={() => queryClient.invalidateQueries()}
      />
      <NewReferralSourceModal
        show={showNewReferralSourceModal}
        toggle={() => setShowNewReferralSourceModal(false)}
        type="contact"
        onSuccess={() => queryClient.invalidateQueries()}
      />
    </MainLayout>
  );
};

export default ReferralSources;
