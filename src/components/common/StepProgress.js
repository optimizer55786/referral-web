import React from "reactn";

import "./css/StepProgress.css";

const StepProgress = ({ steps, active }) => {
  const activeItem = active || 0;

  return (
    <div className="progressbar-wrapper">
      <ul className="progressbar">
        {steps.map((step, i) => {
          return (
            <li key={i} className={i <= activeItem ? "active" : ""}>
              {step}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StepProgress;
