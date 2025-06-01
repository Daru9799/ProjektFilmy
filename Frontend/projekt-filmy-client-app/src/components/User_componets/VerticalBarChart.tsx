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
      >
        <Label
          value={yLabel}
          angle={-90}
          position="insideLeft"
          offset={-5}
          style={{ fill: "#fff" }}
        />
      </YAxis>
      <Tooltip />
      <Bar dataKey={xKey} fill={barColor}>
        <LabelList dataKey={xKey} position="right" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default VerticalBarChart;
