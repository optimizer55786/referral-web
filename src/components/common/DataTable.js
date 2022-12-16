import React, { useEffect, useState } from "reactn";
import PropTypes from "prop-types";
import { Table, Button, Form } from "react-bootstrap";
import get from "lodash.get";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown } from "@fortawesome/pro-solid-svg-icons";

import CustomDropdown from "./CustomDropdown";
import Loading from "./Loading";

const DataTable = ({
  columns,
  data,
  checkboxKey = null,
  actions,
  busy = false,
  defaultSort,
  emptyMsg,
  onSortChange,
  onCheckedChange,
}) => {
  const [checked, setChecked] = useState([]);
  const [sort, setSort] = useState(defaultSort || null);

  useEffect(() => {
    if (columns) {
      let newSort = defaultSort || null;
      if (!newSort) {
        let col = columns.find((c) => c.sortable);
        if (col) {
          newSort = `${col.key}:ASC`;
        }
      }
      setSort(newSort);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  useEffect(() => {
    if (onCheckedChange) {
      onCheckedChange(checked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const toggleChecked = (val) => {
    if (val === "_all") {
      if (checked.includes("_all")) {
        setChecked([]);
      } else {
        setChecked(["_all"]);
      }
      return;
    }

    if (checked.includes(val)) {
      setChecked([...checked].filter((c) => c !== val));
    } else {
      if (checked.includes("_all")) {
        if (data) {
          const vals = [];
          data.forEach((r) => {
            const v = get(r, checkboxKey);
            if (v !== val) {
              vals.push(v);
            }
          });
          setChecked(vals);
        } else {
          setChecked([]);
        }
      } else {
        setChecked([...checked, val]);
      }
    }
  };

  const renderHeaders = () => {
    if (!columns) {
      return;
    }

    const [sortBy, sortDir] = sort ? sort.split(":") : [null, null];

    const tds = [];

    if (checkboxKey) {
      tds.push(
        <th key="cb" width="40">
          <Form.Check
            type="checkbox"
            id="cb-all"
            value="_all"
            onChange={(e) => toggleChecked("_all")}
            label=""
            checked={checked.includes("_all")}
          />
        </th>
      );
    }

    columns.forEach((col, colIndex) => {
      let sortKey = col.sortKey || col.key;
      let icon = faSort;

      if (sortKey === sortBy) {
        icon = sortDir === "ASC" ? faSortDown : faSortUp;
      }

      tds.push(
        <th key={colIndex}>
          {col.sortable ? (
            <Button
              variant="link"
              size="sm"
              className="p-0 text-decoration-none"
              style={{ color: "#000" }}
              onClick={() => {
                let key = col.sortKey || col.key;
                let newSortDir = "ASC";
                if (sortBy === key && sortDir === "ASC") {
                  newSortDir = "DESC";
                }
                setSort(`${key}:${newSortDir}`);
                onSortChange(key, newSortDir);
              }}
            >
              {col.header.toUpperCase()} <FontAwesomeIcon icon={icon} />
            </Button>
          ) : (
            <span style={{ fontSize: 14, fontWeight: 400 }}>
              {col.header.toUpperCase()}
            </span>
          )}
        </th>
      );
    });

    if (actions) {
      tds.push(
        <th key="act" className="text-end">
          <span style={{ fontSize: 14, fontWeight: 400 }}>ACTIONS</span>
        </th>
      );
    }

    return <tr>{tds}</tr>;
  };

  const renderCol = (row, col, colIndex) => {
    const val = col.render ? col.render(row) : get(row, col.key);

    return <td key={colIndex}>{val}</td>;
  };

  const renderRow = (row, rowIndex) => {
    const keyVal = checkboxKey ? get(row, checkboxKey) : "";

    return (
      <tr key={rowIndex}>
        {checkboxKey ? (
          <td width="40">
            <Form.Check
              type="checkbox"
              id={`cb-${keyVal}`}
              value={keyVal}
              onChange={(e) => toggleChecked(keyVal)}
              label=""
              checked={checked.includes(keyVal) || checked.includes("_all")}
            />
          </td>
        ) : null}
        {columns.map((col, colIndex) => {
          return renderCol(row, col, colIndex);
        })}
        {actions ? (
          <td className="text-end">
            <CustomDropdown menuItems={actions} clickData={row} />
          </td>
        ) : null}
      </tr>
    );
  };

  const getHeaderCount = () => {
    let base = columns.length;
    if (checkboxKey) {
      base++;
    }
    if (actions) {
      base++;
    }
    return base;
  };

  const renderRows = () => {
    if (busy) {
      return null;
    }

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={getHeaderCount()}>
            {emptyMsg ? (
              emptyMsg
            ) : (
              <p className="lead text-center">No Results Found</p>
            )}
          </td>
        </tr>
      );
    }

    return data.map((row, rowIndex) => renderRow(row, rowIndex));
  };

  return (
    <div>
      <Table hover={true}>
        <thead>{renderHeaders()}</thead>
        <tbody>{renderRows()}</tbody>
      </Table>
      {busy ? <Loading /> : null}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  checkboxKey: PropTypes.string,
  defaultSort: PropTypes.string,
  emptyMsg: PropTypes.node,
  onSortChange: PropTypes.func.isRequired,
  onCheckedChange: PropTypes.func,
};

export default DataTable;
