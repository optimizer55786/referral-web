import React, { useState } from "reactn";
import PropTypes from "prop-types";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AsyncTable from "../common/AsyncTable";
import TaxonomySelect from "../common/forms/TaxonomySelect";
import { useFormData } from "../../hooks/useFormData";

const CmsExplorerModal = ({ show, toggle }) => {
  const { formData, onChange } = useFormData({
    search: "",
    type: "2",
    taxonomy: null,
  });
  const [filters, setFilters] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Modal show={show} onHide={() => toggle()} fullscreen={true}>
      <Modal.Header closeButton={true}>
        <Modal.Title>CMS Explorer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={onSubmit}>
          <Row>
            <Col xs={12} sm={6} md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="search"
                  name="search"
                  onChange={onChange}
                  value={formData.search}
                  placeholder="Search..."
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  name="type"
                  onChange={onChange}
                  value={formData.type}
                >
                  <option value="1">Individual</option>
                  <option value="2">Organization</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={3} className="mb-3">
              <Form.Group>
                <Form.Label>Taxonomy/Specialization</Form.Label>
                <TaxonomySelect
                  value={formData.taxonomy}
                  isMulti={false}
                  onChange={(val) =>
                    onChange({ target: { name: "taxonomy", value: val } })
                  }
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={3} className="mb-3 text-end">
              <div style={{ marginTop: "32px" }}>
                <Button variant="light" className="me-2">
                  Clear
                </Button>
                <Button type="submit" variant="primary">
                  Search
                </Button>
              </div>
            </Col>
          </Row>
        </form>
        <hr />
        <AsyncTable
          cacheKey="cms-data"
          endpoint="/cms/nppes"
          filters={filters}
          columns={[
            {
              header: "Name",
              key: "_name",
            },
            {
              header: "NPI",
              key: "npi",
            },
            {
              header: "Entity Type",
              key: "entity_type_code",
              render: (row) => {
                return row.entity_type_code === "1"
                  ? "Individual"
                  : "Organization";
              },
            },
          ]}
        />
      </Modal.Body>
    </Modal>
  );
};

CmsExplorerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default CmsExplorerModal;
