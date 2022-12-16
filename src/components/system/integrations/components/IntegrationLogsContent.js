import React from "reactn";
import { Table } from "react-bootstrap";

const IntegrationLogsContent = () => {
  return (
    <div>
      <p>
        Below are a list of integration files received and actions taken with
        each.
      </p>

      <Table>
        <thead>
          <tr>
            <th>File</th>
            <th>Received</th>
            <th>Total Records</th>
            <th>Processed</th>
            <th>Errors</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="6">
              <p className="lead text-center">
                No intgration files have been received.
              </p>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default IntegrationLogsContent;
