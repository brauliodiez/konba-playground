// src/components/SvgLoader.tsx
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image } from "react-konva";
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

  const convertImage = (imageUrl: string, coord: Coordinate) => {
    const [img] = useImage(imageUrl);
    return <Image image={img} x={coord.x} y={coord.y} draggable />;
  };

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
        {widgetImageCollection.map((widget) =>
          convertImage(widget.imageUrl, widget.coord)
        )}
      </Layer>
    </Stage>
  );
};

export default SvgLoader;
