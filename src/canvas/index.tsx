// src/components/SvgLoader.tsx
import React, { useEffect, useRef } from "react";
import { Stage, Layer } from "react-konva";
import Konva from "konva";

export const SvgLoader: React.FC = () => {
  const layerRef = useRef<Konva.Layer>(null);

  const addSvgWidget = (url: string, x: number, y: number) => {
    Konva.Image.fromURL(url, (imageNode) => {
      imageNode.setAttrs({
        x,
        y,
        scaleX: 1,
        scaleY: 1,
      });

      layerRef.current?.add(imageNode);
      layerRef.current?.draw();
    });
  };

  useEffect(() => {
    addSvgWidget("/widgets/combobox.svg", 50, 50);
    addSvgWidget("/widgets/input.svg", 400, 50);
    addSvgWidget("/widgets/button.svg", 800, 50);
    addSvgWidget("/containers/browser.svg", 50, 300);
    addSvgWidget("/containers/mobile.svg", 600, 300);
    addSvgWidget("/containers/tablet.svg", 900, 300);
  }, []);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer ref={layerRef} />
    </Stage>
  );
};

export default SvgLoader;
