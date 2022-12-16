import React, { useState } from "reactn";
import PropTypes from "prop-types";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import moment from "moment-timezone";

import { Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faMapMarked,
  faSpinnerThird,
} from "@fortawesome/pro-regular-svg-icons";

import { address } from "../../lib/stringHelpers";
import { useApiPost } from "../../hooks/useApi";

export const FullGoogleMap = withScriptjs(
  withGoogleMap((props) => {
    return (
      <GoogleMap
        defaultZoom={props.defaultZoom}
        defaultCenter={props.centerPoint}
      >
        <Marker
          position={props.centerPoint}
          icon="https://public-referral-lab.s3.us-east-2.amazonaws.com/map-icons/circle-red.png"
          onClick={() =>
            props.onMarkerClick({ target: props.centerPoint, marker: null })
          }
        />
        {props.markers.map((marker, i) => {
          return (
            <Marker
              key={i}
              position={marker.position}
              title={marker.title}
              icon={marker.icon}
              onClick={() =>
                props.onMarkerClick({
                  target: props.centerPoint,
                  key: i,
                  marker,
                })
              }
            >
              {props.showOverlay === i ? (
                <InfoWindow onCloseClick={() => props.onInfoWindowClose()}>
                  <div>
                    <p className="mb-2">
                      <a
                        href={`/referral-sources/${marker.record.referral_source_id}`}
                      >
                        {marker.record.referral_source_name}
                      </a>
                    </p>
                    <p className="mb-1">{address(marker.record)}</p>
                    {marker.record._next_date ? (
                      <p>
                        Scheduled For:{" "}
                        {moment(marker.record._next_date).format("MM/DD/YYYY")}
                      </p>
                    ) : null}
                    <Row>
                      <Col>
                        <a
                          href={`https://www.google.com/maps/place/${window.encodeURI(
                            address(marker.record)
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-link"
                        >
                          <FontAwesomeIcon icon={faMapMarked} /> Directions
                        </a>
                      </Col>
                      <Col>
                        <Button
                          size="sm"
                          variant="link"
                          disabled={
                            marker.record.schedule_id !== null ||
                            props.processing
                          }
                          onClick={() => props.onInstantSchedule(marker.record)}
                        >
                          <FontAwesomeIcon
                            icon={
                              props.processing ? faSpinnerThird : faCalendarDay
                            }
                            spin={props.processing}
                          />{" "}
                          Schedule
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </InfoWindow>
              ) : null}
            </Marker>
          );
        })}
      </GoogleMap>
    );
  })
);

const SimpleGoogleMap = ({
  centerPoint = { lat: 34.257439, lng: -88.703407 },
  markers = [],
  onRefresh,
}) => {
  const [showOverlay, setShowOverlay] = useState(null);
  const api = useApiPost(
    "/schedule",
    (resp) => {
      toast.success("Your schedule for today was successfully updated.");
      onRefresh();
    },
    {
      onError: (err) => {
        toast.error(err.message);
      },
    }
  );

  return (
    <FullGoogleMap
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100%` }} />}
      mapElement={<div style={{ height: `100%` }} />}
      centerPoint={centerPoint}
      markers={markers}
      defaultZoom={11}
      onMarkerClick={(e) => {
        setShowOverlay(e.key === showOverlay ? null : e.key);
      }}
      processing={api.isLoading}
      showOverlay={showOverlay}
      onInfoWindowClose={() => setShowOverlay(null)}
      onInstantSchedule={(record) => {
        api.mutate({
          referral_source_id: record.referral_source_id,
          schedule_start_date: moment()
            .set({ hour: 12, minutes: 0, seconds: 0 })
            .toDate(),
          schedule_rrule: null,
          schedule_details: "Scheduled from Map",
        });
      }}
    />
  );
};

SimpleGoogleMap.propTypes = {
  centerPoint: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }),
  markers: PropTypes.array.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default SimpleGoogleMap;
