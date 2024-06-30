import { ShapeConfig } from "konva/lib/Shape";
import { forwardRef } from "react";
import { Path, Group } from "react-konva";
//import { Path, Text, Group } from "react-konva";

interface ComboBoxShapeProps extends ShapeConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const ComboBoxShape = forwardRef<any, ComboBoxShapeProps>(
  ({ x, y, width, height, ...shapeProps }, ref) => {
    return (
      <Group
        x={x}
        y={y}
        ref={ref}
        width={width}
        height={height}
        {...shapeProps}
      >
        {/* Rectangle */}
        <Path
          data={`M1,1 H${width - 2} V${height - 2} H1 Z`}
          stroke="black"
          strokeWidth={2}
          fill="blue"
        />
      </Group>
    );
  }
);

// {/* Line */}
// <Path
//   data={`M${width - 40},1 L${width - 40},${height - 1}`}
//   stroke="black"
//   strokeWidth={2}
// />
// {/* Polygon (Arrow) */}
// <Path
//   data={`M${width - 30},${height / 2 - 15} L${width - 10},${
//     height / 2 - 15
//   } L${width - 20},${height / 2}`}
//   fill="black"
// />
// {/* Text */}
// <Text
//   x={10}
//   y={height / 2 + 5}
//   text="Select an option"
//   fontSize={20}
//   fontFamily="Arial"
//   fill="black"
// />
