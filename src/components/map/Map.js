import React, { useState, useEffect, useGlobal } from "reactn";
import { 
  Row, 
  Col, 
  Form, 
  Card, 
  Alert, 
  Button, 
  Popover, 
  OverlayTrigger
} from "react-bootstrap";
import { useQueryClient } from "react-query";
import useGeolocation from "react-hook-geolocation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faChevronRight,
  faMapPin,
} from "@fortawesome/pro-regular-svg-icons";
import moment from "moment-timezone";

import { useApiGet } from "../../hooks/useApi";
import MainLayout from "../layout/MainLayout";
import ContentBlock from "../common/ContentBlock";
import Loading from "../common/Loading";
import SimpleGoogleMap from "./SimpleGoogleMap";
import { address } from "../../lib/stringHelpers";
import { useFormData } from "../../hooks/useFormData";
import UserSelect from "../common/forms/UserSelect";
import OrgSelect from "../common/forms/OrgSelect";
import CustomDropdown from "../common/CustomDropdown";
import "./css/Map.css";

const Map = () => {
  const [curPos, setCurPos] = useState(null);
  const [user] = useGlobal("user");
  const geolocation = useGeolocation({}, (loc) => {
    setCurPos(loc);
  });
  const queryClient = useQueryClient();
  const defaultVals = {
    search: "",
    type: "Facility",
    assigned_user: {value:user.user_id, label: user.name, record: user },
    maxDistance: 20,
    scheduled: false,
    org: null
  };
  const { formData, onChange, setData } = useFormData(defaultVals);
  const [ filters, setFilters ] = useState(formData);
  const { isLoading, isFetching, data, isError, error } = useApiGet(
    `map`,
    "/referral-sources/nearby",
    { 
      lat: curPos?.latitude, 
      lng: curPos?.longitude, 
      maxDistance: filters.maxDistance, 
      type: filters.type.toLowerCase(),
      search: filters.search,
      assigned_user: filters.assigned_user ? filters.assigned_user.value : null,
      scheduled: filters.scheduled,
      org: filters.org?.value
    },
    { staleTime: 1000 }
  );
  
  const isLocal = () => {
    return process.env.REACT_APP_API_URL.indexOf(".local") > -1;
  };

  useEffect(() => {
    if (isLocal()) {
      setCurPos({ latitude: 34.257439, longitude: -88.703407 });
    }
  }, []);

  useEffect(() => {
    if (data && data.new_lat) {
      setCurPos({ latitude: data.new_lat, longitude: data.new_lng });
    }
  }, [data]);
  // useEffect(() => {
  //   if (curPos) {
  //   }
  // }, [curPos]);
  const onSubmit = (e) => {
    e.preventDefault();
    if(formData.org){
      setCurPos({latitude: formData.org.record.lat, longitude: formData.org.record.lng })
    } else {
      if(isLocal()){
        setCurPos({ latitude: 34.257439, longitude: -88.703407 });
      } else {
        setCurPos({ latitude: geolocation.latitude, longitude: geolocation.longitude });
      }
    }
    setFilters(formData);
  };

  const onClear = () => {
    setData(defaultVals);
    setFilters(defaultVals);
    if(isLocal()){
      setCurPos({ latitude: 34.257439, longitude: -88.703407 });
    } else {
      setCurPos({ latitude: geolocation.latitude, longitude: geolocation.longitude });
    }
  };
  
  const getMarkers = () => {
    const markers = [];

    data.rows.scheduled.forEach((row) => {
      markers.push({
        position: { lat: row.lat, lng: row.lng },
        title: row.referral_source_name,
        icon: "https://public-referral-lab.s3.us-east-2.amazonaws.com/map-icons/circle-blue.png",
        record: row,
      });
    });

    data.rows.nearby.forEach((row) => {
      let assigned_id = filters.assigned_user ? filters.assigned_user.value : user.user_id;
      let icon = "gray";
      if(row._assigned_users.findIndex((u)=>u.user_id === assigned_id) !== -1){
        icon = "purple";
      }
      markers.push({
        position: { lat: row.lat, lng: row.lng },
        title: row.referral_source_name,
        icon: `https://public-referral-lab.s3.us-east-2.amazonaws.com/map-icons/circle-${icon}.png`,
        record: row,
      });
    });

    return markers;
  };
  const renderList = (list, color, showNextDt = false) => {
    return list.map((row, i) => {
      const addr = address(row);
      return (
        <Card key={i} className="mb-3">
          <Card.Body>
            <div className="float-end">
              <a
                className="btn btn-link"
                href={`https://www.google.com/maps/place/${window.encodeURI(
                  addr
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </a>
            </div>
            <img
              src={`https://public-referral-lab.s3.us-east-2.amazonaws.com/map-icons/circle-${color}.png`}
              alt=""
              style={{ width: 15, height: 15 }}
            />{" "}
            {row.referral_source_name}
            <small className="text-muted d-block">{addr}</small>
            {row._next_date && showNextDt ? (
              <small className="text-muted">
                Next Schedule: {moment(row._next_date).format("MM/DD/YYYY")}
              </small>
            ) : null}
          </Card.Body>
        </Card>
      );
    });
  };
  const renderMap = () => {
    if (isLocal() && curPos === null) {
      return <p>Getting your location...</p>;
    } else if (isLoading || isFetching) {
      return <Loading />;
    } else if (geolocation.error && !isLocal()) {
      return (
        <Alert variant="danger">
          No geolocation data could be gathered. Did you decline permission?
        </Alert>
      );
    } else if (isError) {
      return <Alert variant="danger">{error.message}</Alert>;
    } else if (curPos === null || !curPos.latitude || !curPos.longitude) {
      return (
        <>
          <Loading />
        </>
      );
    }

    return (
      <Row style={{minHeight:"400px"}}>
        <Col className="mb-3">
          <SimpleGoogleMap
            centerPoint={{ lat: curPos.latitude, lng: curPos.longitude }}
            markers={getMarkers()}
            onRefresh={() => {
              queryClient.invalidateQueries("map");
            }}
          />
        </Col>
        <Col xs={12} md={3} style={{maxHeight:"500px", overflowY:"scroll"}}>
            {data.rows.scheduled.length > 0 ? (
                <h6 className="mt-2">
                  <FontAwesomeIcon icon={faMapPin} fixedWidth={true} />{" "}
                  Scheduled Today
                </h6>
              ) : null}
            { renderList(data.rows.scheduled, "blue") }
            {data.rows.nearby.length > 0 ? (
                <h6 className="mt-2">
                  <FontAwesomeIcon icon={faMapPin} fixedWidth={true} /> Near By
                </h6>
              ) : null}
            { renderList(data.rows.nearby, "purple", true) }
        </Col>
      </Row>
    );
  };
  const distancePopover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Distance</Popover.Header>
      <Popover.Body>
        <Form.Range 
          value={formData.maxDistance}
          onChange={onChange}
          name="maxDistance"
          min={0}
          max={100}
        />
      </Popover.Body>
    </Popover>
  );
  return (
    <MainLayout>
      <ContentBlock 
        title="Map" 
        className="mb-3"
        titleRight={
          <>
              <CustomDropdown
                menuItems={[
                  {
                    label: "Schduled on today",
                    onClick: () => {
                      onChange({ target: { name: "scheduled", value: true } })
                      setFilters({...formData, scheduled: true});
                    },
                  },
                ]}
                label="Quick filter"
                icon={faSearch}
                className="me-2 btn-white"
              >
                Quick filter
              </CustomDropdown>
          </>
        }
      >
        <form onSubmit={onSubmit} className="mb-3">
          <Row>
            {
              user.role_name !== "rep" && (
                <Col>
                  <Form.Group>
                    <Form.Label>Organization</Form.Label>
                    <OrgSelect
                      value={formData.org}
                      onChange={(val) =>
                        onChange({ target: { name: "org", value: val } })
                      }
                      isMulti={false}
                      type="branch"
                    />
                  </Form.Group>
                </Col>
              )
            }
            <Col>
              <Form.Group>
                <Form.Label>Search Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="search" 
                  placeholder="Search..." 
                  value={formData.search}
                  onChange={onChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Referral Source Type</Form.Label>
                <Form.Select name="type" value={formData.type} onChange={onChange}>
                  {[
                    "All",
                    "Facility",
                    "Provider",
                    "Contact",
                  ].map((v, i) => {
                    return (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    );
                  })}
                </Form.Select>
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
                />
              </Form.Group>
            </Col>
            <Col>
              <div style={{ marginTop: "32px" }}>
                <OverlayTrigger trigger="click" placement="bottom" overlay={distancePopover}>
                  <Button  variant="light">
                    Distance ({formData.maxDistance} miles)
                  </Button>
                </OverlayTrigger>
              </div>
            </Col>
            <Col>
              <div className="text-end" style={{ marginTop: "32px" }}>
                <Button
                  variant="light"
                  onClick={onClear}
                  className="me-2"
                >
                  Reset
                </Button>
                <Button type="submit" variant="primary">
                  Filter
                </Button>
              </div>
            </Col>
          </Row>
        </form>
      </ContentBlock>
      { renderMap() }
     
    </MainLayout>
  );
};

export default Map;
