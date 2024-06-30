// src/components/SvgLoader.tsx
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Rect, Transformer } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import {
  mockLayoutImageCollection,
  mockWidgetImageCollection,
} from "./mock-data";
import { Coordinate } from "./canvas.model";
import { ComboBoxShape } from "./components";

export const SvgLoader: React.FC = () => {
  const baseLayerRef = useRef<Konva.Layer>(null);
  const widgetLayerRef = useRef<Konva.Layer>(null);
  const [widgetImageCollection] = useState(mockWidgetImageCollection);
  const [layoutImageCollection] = useState(mockLayoutImageCollection);
  const [comboProps, setComboProps] = useState({
    x: 50,
    y: 150,
    width: 230,
    height: 50,
  });
  const comboRef = useRef<any>();
  const trRef = useRef<any>();

  const convertImage = (imageUrl: string, coord: Coordinate) => {
    const [img] = useImage(imageUrl);
    return <Image image={img} x={coord.x} y={coord.y} draggable />;
  };

  const handleTransformEnd = () => {
    const node = comboRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Update the width and height and reset the scale
    setComboProps((comboProps) => ({
      ...comboProps,
      width: comboProps.width * scaleX,
      height: comboProps.height * scaleY,
    }));

    node.width(comboProps.width);
    node.height(comboProps.height);
    // Reset the scale to avoid further scaling
    node.scaleX(1);
    node.scaleY(1);
  };

  useEffect(() => {
    if (trRef.current && comboRef.current) {
      trRef.current.nodes([comboRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, []);

  useEffect(() => {
    // Ensure layers are re-drawn when references are updated
    if (baseLayerRef.current) {
      baseLayerRef.current.batchDraw();
    }
    if (widgetLayerRef.current) {
      widgetLayerRef.current.batchDraw();
    }
  }, [layoutImageCollection, widgetImageCollection]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer ref={baseLayerRef}>
        {layoutImageCollection.map((widget) =>
          convertImage(widget.imageUrl, widget.coord)
        )}
      </Layer>

      <Layer ref={widgetLayerRef}>
        <ComboBoxShape
          ref={comboRef}
          {...comboProps}
          draggable
          onTransformEnd={handleTransformEnd}
        />
        {widgetImageCollection.map((widget) =>
          convertImage(widget.imageUrl, widget.coord)
        )}
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height > 51) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
};

export default SvgLoader;
