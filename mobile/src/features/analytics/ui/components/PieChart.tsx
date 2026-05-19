import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Slice = {
  value: number;
  color: string;
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M',
    x,
    y,
    'L',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'Z',
  ].join(' ');
};

export const PieChart = ({ slices, size = 180 }: { slices: Slice[]; size?: number }) => {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  if (total <= 0) {
    return <View style={{ width: size, height: size }} />;
  }

  let startAngle = 0;
  return (
    <Svg width={size} height={size}>
      {slices.map((slice, index) => {
        const angle = (slice.value / total) * 360;
        const endAngle = startAngle + angle;
        const path = describeArc(size / 2, size / 2, size / 2, startAngle, endAngle);
        const element = <Path key={index} d={path} fill={slice.color} />;
        startAngle = endAngle;
        return element;
      })}
    </Svg>
  );
};
