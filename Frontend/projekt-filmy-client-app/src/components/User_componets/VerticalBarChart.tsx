import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  Label,
} from "recharts";

type Props = {
  data: any[];
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
  barColor: string;
};

const renderCustomTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="end"
      dominantBaseline="middle"
      fontSize={12}
    >
      {payload.value}
    </text>
  );
};

const VerticalBarChart = ({
  data,
  xKey,
  yKey,
  xLabel,
  yLabel,
  barColor,
}: Props) => (
  <div style={{ width: "100%", overflowX: "auto" }}> {/* dodane */}
    <div style={{ minWidth: "500px" }}> {/* minimalna szerokość wykresu */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 80, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number">
            <Label
              value={xLabel}
              position="bottom"
              offset={10}
              style={{ fill: "#fff" }}
            />
          </XAxis>
          <YAxis
            dataKey={yKey}
            type="category"
            tick={renderCustomTick}
            interval={0}
            width={120}
            tickLine={false}
          >
            <Label
              value={yLabel}
              angle={-90}
              position="insideLeft"
              offset={-20}
              style={{ fill: "#fff" }}
            />
          </YAxis>
          <Tooltip />
          <Bar dataKey={xKey} fill={barColor}>
            <LabelList dataKey={xKey} position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default VerticalBarChart;
