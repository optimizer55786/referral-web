import React, {useState} from "reactn";
import PropTypes from "prop-types";
import { Popover, ButtonGroup, ToggleButton, Button } from "react-bootstrap";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const DateFilterPopover = ({onSuccess}) => {

  const [dateOption, setDateOption] = useState('1');

  const options = [
    { name: 'Start Of Care Date', value: 'start_of_care_date' },
    { name: 'Referral Date', value: 'referral_date' },
    { name: 'Nonadmit Date', value: 'nonadmit_date' },
  ];
  const defaultDateRange = [{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }]
  const [dateRange, setDateRange] = useState(defaultDateRange);
  return (
    <Popover >
      <Popover.Header closeButton={true}>
        <Popover.Title>Select Date</Popover.Title>
      </Popover.Header>
      <Popover.Body>
        <ButtonGroup className="mb-2">
          {options.map((option, idx) => (
            <ToggleButton
              key={idx}
              id={`option-${idx}`}
              type="radio"
              variant="outline-primary"
              name="dateOption"
              value={option.value}
              checked={dateOption === option.value}
              onChange={(e) => {
                setDateOption(e.currentTarget.value);
                setDateRange(defaultDateRange)
              }}
            >
              {option.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
        <div className="d-flex justify-content-center mt-4">
          <DateRangePicker
            onChange={item => setDateRange([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={dateRange}
            direction="vertical"
            scroll={{enabled:true}}
          />
        </div>
      </Popover.Body>

    </Popover>
  );
};

DateFilterPopover.propTypes = {
  onSuccess: PropTypes.func
};

export default DateFilterPopover;
