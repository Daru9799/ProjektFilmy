import { useId } from "react";
import VerticalBarChart from "./VerticalBarChart";

type Props = {
  title: string;
  data: any[];
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
  barColor: string;
  emptyMessage?: string;
};

const AccordionChart = ({
  title,
  data,
  xKey,
  yKey,
  xLabel,
  yLabel,
  barColor,
  emptyMessage = "Brak danych.",
}: Props) => {
  const id = useId();

  return (
    <div className="accordion-item bg-dark text-white">
      <h2 className="accordion-header" id={`heading-${id}`}>
        <button
          className="accordion-button collapsed bg-dark text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#collapse-${id}`}
        >
          {title}
        </button>
      </h2>
      <div
        id={`collapse-${id}`}
        className="accordion-collapse collapse"
        data-bs-parent="#userStatsAccordion"
      >
        <div className="accordion-body">
          {data.length ? (
            <VerticalBarChart
              data={data}
              xKey={xKey}
              yKey={yKey}
              xLabel={xLabel}
              yLabel={yLabel}
              barColor={barColor}
            />
          ) : (
            <p>{emptyMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccordionChart;
