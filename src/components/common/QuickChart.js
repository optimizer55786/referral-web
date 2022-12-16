import React from "reactn";
import PropTypes from "prop-types";
import { Bar, Line, Doughnut } from "react-chartjs-2";

const defaultColors = [
  "#252b3b",
  "#403859",
  "#6a416e",
  "#9b4775",
  "#c84e6e",
  "#ec5f5a",
  "#ff7e3c",
  "#ffa600",
].reverse();

const QuickChart = ({
  chartType = "line",
  data,
  height = 50,
  width = "100%",
  title = undefined,
  showLabels = true,
  showGrid = true,
  colors = null,
}) => {
  const datasets = data.map((datum) => {
    return {
      label: datum.label,
      data: Object.values(datum.data),
      backgroundColor: colors || defaultColors,
    };
  });

  const getChartType = () => {
    switch (chartType) {
      case "bar":
        return Bar;
      case "doughnut":
        return Doughnut;
      case "line":
      default:
        return Line;
    }
  };

  const options = {};

  if (chartType !== "doughnut" && !showGrid) {
    options.scales = {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    };
  }

  if (!showLabels) {
    options.legend = { display: false };
  }

  const Component = getChartType();

  return (
    <div className="chart-container h-100">
      <Component
        data={{
          labels: Object.keys(data[0].data),
          datasets,
        }}
        width={width}
        height={height}
        options={options}
      />
    </div>
  );
};

QuickChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      data: PropTypes.object.isRequired,
    })
  ),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  showLabels: PropTypes.bool,
  showGrid: PropTypes.bool,
  colros: PropTypes.arrayOf(PropTypes.string),
};

export default QuickChart;
