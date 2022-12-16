import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Button, Form, Table } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheck,
  faPlus,
  faSpinnerThird,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";

import { useApiPost } from "../../../../hooks/useApi";

const fields = [
  { label: "Patient Name", value: "patient.patient_name", isRequired: true },
  { label: "Patient ID/MRN", value: "patient.patient_mrn", isRequired: true },
  {
    label: "Patient Zip Code",
    value: "patient.patient_zip",
    isRequired: false,
  },
];

const defaultRowVals = {
  colName: "",
  mapsTo: "",
  isRequired: false,
};

const FieldMappingsContent = ({ integrationSettings }) => {
  const [fieldMap, setFieldMap] = useState(
    integrationSettings ? integrationSettings.integration_setting_field_map : []
  );

  useEffect(() => {
    if (integrationSettings) {
      return;
    }

    const defaultMap = [];

    fields.forEach((f) => {
      if (f.isRequired) {
        defaultMap.push({
          colName: "",
          mapsTo: f,
          isRequired: true,
        });
      }
    });

    setFieldMap(defaultMap);
  }, []);

  const handleFieldChange = (key, index, val) => {
    const changes = [...fieldMap];
    changes[index][key] = val;
    setFieldMap(changes);
  };

  const removeMapping = (index) => {
    if (fieldMap.length === 1) {
      return;
    }

    const newMap = fieldMap.filter((m, mIndex) => mIndex !== index);
    setFieldMap(newMap);
  };

  const callApi = useApiPost(
    "/integrations/field-map",
    (res) => {
      toast.success("Your integration field map has been successfully saved.");
    },
    {
      onError: (err) => toast.error(err.message),
    }
  );

  return (
    <div>
      <div className="mb-3">
        <p className="lead">
          As part of your integration with Referral Lab.ai, all referral records
          that come into our system undergo a process of normalization and
          enrichment. The first step of that process is normalization - or the
          conversion of your data into a normal, expected shape and format for
          our system. The definition below will help us ensure that the data you
          send us is appropriately mapped to the correct fields.
        </p>
      </div>

      <Table>
        <thead>
          <tr>
            <th width="75">&nbsp;</th>
            <th width="300">Import Column Header</th>
            <th width="100">Maps To</th>
            <th>RL Field</th>
          </tr>
        </thead>
        <tbody>
          {fieldMap.map((row, rowIndex) => {
            return (
              <tr key={rowIndex}>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => removeMapping(rowIndex)}
                    disabled={fieldMap.length === 1 || row.isRequired}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
                <td>
                  <Form.Control
                    name={`col-name-${rowIndex}`}
                    value={row.colName}
                    onChange={(e) =>
                      handleFieldChange("colName", rowIndex, e.target.value)
                    }
                    required={true}
                  />
                </td>
                <td className="text-center">
                  <FontAwesomeIcon icon={faArrowRight} />
                </td>
                <td>
                  <div style={{ maxWidth: 350 }}>
                    <Select
                      options={fields}
                      onChange={(val) =>
                        handleFieldChange("mapsTo", rowIndex, val)
                      }
                      value={row.mapsTo}
                      isSearchable={true}
                      isDisabled={row.isRequired}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Row>
        <Col>
          <Button
            variant="light"
            onClick={() => setFieldMap([...fieldMap, { ...defaultRowVals }])}
            disabled={callApi.isLoading}
          >
            <FontAwesomeIcon icon={faPlus} fixedWidth={true} /> Add Row
          </Button>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => callApi.mutate(fieldMap)}
            disabled={callApi.isLoading}
          >
            <FontAwesomeIcon
              icon={callApi.isLoading ? faSpinnerThird : faCheck}
              fixedWidth={true}
              spin={callApi.isLoading}
            />{" "}
            {callApi.isLoading ? "Saving..." : "Save Field Map"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

FieldMappingsContent.propTypes = {
  integrationSettings: PropTypes.object,
};

export default FieldMappingsContent;
