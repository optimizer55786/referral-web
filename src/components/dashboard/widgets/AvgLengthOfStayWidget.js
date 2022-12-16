import React from "reactn";
import { AreaChart } from "react-chartkick";
import "chartkick/chart.js";

import ContentBlock from "../../common/ContentBlock";

const AvgLengthOfStayWidget = ({ data }) => {
  return (
    <ContentBlock>
      <h5>Avg Length Of Stay</h5>
      <AreaChart
        data={{
          April: 36,
          May: 29,
          June: 22,
          July: 24.75,
          August: 29,
          September: 36,
        }}
        legend={false}
        height={150}
        area={true}
      />
    </ContentBlock>
  );
};

export default AvgLengthOfStayWidget;
