import React, { useState, useDispatch } from "reactn";
import { toast } from "react-toastify";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { useQueryClient } from "react-query";
import AsyncTable from "../../common/AsyncTable";
import { useFormData } from "../../../hooks/useFormData";
import AddLocationModal from "./AddLocationModal";
import EditLocationModal from "./EditLocationModal";

const Locations = ({ refSource }) => {
  const { formData, onChange } = useFormData({ search: "" });
  const [filters, setFilters] = useState({});
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [editLocationModal, setEditLocationModal] = useState(null);
  const queryClient = useQueryClient();
  const confirmation = useDispatch("confirmation");

  const onSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...formData });
  };

  const handleDelete = (row) => {
    confirmation({
      asyncUrl: `/referral-sources/address/${row.address_id}`,
      asyncMethod: "delete",
      question:
        "Are you sure you want to delete the selected location?",
      onConfirm: () => {
        toast.success(
          "The selected location was successfully removed."
        );
        queryClient.invalidateQueries("");
      },
    });
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mb-3">
        <Row>
          <Col xs={12} sm={6} md={4}>
            <Form.Control
              type="search"
              name="search"
              value={formData.search}
              onChange={onChange}
              placeholder="Search..."
            />
          </Col>
          <Col className="mb-3 text-end">
            <Button variant="light" onClick={() => setShowAddLocationModal(true)}>
              <FontAwesomeIcon icon={faPlus} /> Add Location
            </Button>
          </Col>
        </Row>
      </form>

      <AsyncTable
        cacheKey={`addresses-${refSource.referral_source_id}`}
        endpoint={`/referral-sources/${refSource.referral_source_id}/addresses`}
        sortBy="city"
        sortDir="ASC"
        filters={filters}
        columns={[
          {
            header: "Street 1",
            key: "street_1",
            sortable: true,
          },
          {
            header: "Street 2",
            key: "street_2",
            sortable: true,
          },
          {
            header: "City",
            key: "city",
            sortable: true,
          },
          {
            header: "State",
            key: "state",
            sortable: true,
          },
          {
            header: "Zip",
            key: "zip",
            sortable: true,
          },
        ]}
        rowActions={[
          {
            label: "Set Default",
            onClick: () => toast.info("TOGGLE"),
          },
          {
            label: "Map",
            onClick: () => toast.info("MAP"),
          },
          {
            label: "Edit",
            onClick: (row) => { setEditLocationModal(row);},
            isDisabled: (row) => { return row.cms_location_id !== null } 
          },
          {
            label: "Delete",
            onClick: handleDelete,
            isDisabled: (row) => { return row.cms_location_id !== null } 
          },
        ]}
      />
      <AddLocationModal
        show = {showAddLocationModal}
        toggle = {() => setShowAddLocationModal(false)}
        referralSource = {refSource}
        onSuccess = {()=> queryClient.invalidateQueries(`addresses-${refSource.referral_source_id}`)}
      />
      <EditLocationModal
        show = {editLocationModal !== null}
        toggle = {() => setEditLocationModal(null)}
        referralSource = {refSource}
        onSuccess = {()=> queryClient.invalidateQueries(`addresses-${refSource.referral_source_id}`)}
        address = {editLocationModal || {
          street_1: "",
          street_2: "",
          city: "",
          state: "",
          zip: "",
          address_id: ""
        }}
      />
    </>
  );
};

export default Locations;
