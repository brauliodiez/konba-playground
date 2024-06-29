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

export const SvgLoader: React.FC = () => {
  const baseLayerRef = useRef<Konva.Layer>(null);
  const widgetLayerRef = useRef<Konva.Layer>(null);
  const [widgetImageCollection] = useState(mockWidgetImageCollection);
  const [layoutImageCollection] = useState(mockLayoutImageCollection);
  const [rectProps, setRectProps] = useState({
    x: 50,
    y: 50,
    width: 100,
    height: 100,
    fill: "blue",
    draggable: true,
  });
  const rectRef = useRef<any>();
  const trRef = useRef<any>();

  const convertImage = (imageUrl: string, coord: Coordinate) => {
    const [img] = useImage(imageUrl);
    return <Image image={img} x={coord.x} y={coord.y} draggable />;
  };

  const handleTransformEnd = () => {
    const node = rectRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Update the width and height and reset the scale
    setRectProps({
      ...rectProps,
      width: node.width() * scaleX,
      height: node.height() * scaleY,
    });

    // Reset the scale to avoid further scaling
    node.scaleX(1);
    node.scaleY(1);
  };

  useEffect(() => {
    if (trRef.current && rectRef.current) {
      trRef.current.nodes([rectRef.current]);
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
        <Rect
          ref={rectRef}
          {...rectProps}
          onTransformEnd={handleTransformEnd}
        />
        {widgetImageCollection.map((widget) =>
          convertImage(widget.imageUrl, widget.coord)
        )}
        <Transformer ref={trRef} />
      </Layer>
    </Stage>
  );
};

export default SvgLoader;
