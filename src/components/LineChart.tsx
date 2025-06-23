// src/components/LineChart.tsx
import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import * as d3 from "d3-shape";

interface Point {
  x: number;
  y: number;
}

interface LineChartProps {
  width: number;
  height: number;
  data: Point[];
  strokeColor?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  width,
  height,
  data,
  strokeColor = "#4ADE80",
}) => {
  const line = d3
    .line<Point>()
    .x((d: { x: number }) => d.x)
    .y((d: { y: number }) => height - d.y) // Invert y-axis
    .curve(d3.curveMonotoneX)(data);

  return (
    <View>
      <Svg width={width} height={height}>
        <Path d={line!} fill="none" stroke={strokeColor} strokeWidth={2} />
      </Svg>
    </View>
  );
};

export default LineChart;
