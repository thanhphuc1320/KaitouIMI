import React from 'react';
import { Group, Circle, Text } from 'react-konva';

export const TextCircle = ({
  obj,
  scaleRatio,
  index,
  circleSize,
  textSize,
  textLineHeight,
}) => {
  return (
    <Group x={(circleSize * scaleRatio) / 2} y={obj.glossary.y * scaleRatio}>
      <Circle
        height={circleSize * scaleRatio}
        width={circleSize * scaleRatio}
        y={(circleSize - textSize) * scaleRatio}
        fill={obj.icon.color}
      />
      <Text
        fontStyle="bold"
        width={scaleRatio * textLineHeight}
        x={(-scaleRatio * textLineHeight) / 2}
        verticalAlign="middle"
        align="center"
        fontSize={scaleRatio * textSize}
        text={index + 1}
        fill="#fff"
      />
    </Group>
  );
};
