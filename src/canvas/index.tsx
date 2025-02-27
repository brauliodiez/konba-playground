// src/components/SvgLoader.tsx
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image, Transformer } from "react-konva";
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Konva from "konva";
import useImage from "use-image";
import {
  mockLayoutImageCollection,
  mockWidgetImageCollection,
} from "./mock-data";
import { Coordinate } from "./canvas.model";
import { ComboBoxShape } from "./components";
import invariant from "tiny-invariant";

export const SvgLoader: React.FC = () => {
  const baseLayerRef = useRef<Konva.Layer>(null);
  const widgetLayerRef = useRef<Konva.Layer>(null);
  const stageRef = useRef<Konva.Stage>(null);
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

  // Pragmatic drag and drop
  const dropRef = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  // --Pragmatic drag and drop

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

  // <Pragmatic drag and drop>
  useEffect(() => {
    const el = dropRef.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ destination: "canvas" }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, []);

  React.useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // si se suelta fuera de cualquier target
          return;
        }

        const type = source.data.type;
        if (type === "combobox") {
          console.log("Combobox dropped on canvas");
          const stage = stageRef.current;
          invariant(stage);

          const pragmaticDropInfo = location.current.input;
          const screenPosition = {
            x: pragmaticDropInfo.clientX,
            y: pragmaticDropInfo.clientY,
          };
          if (screenPosition) {
            console.log("screen position", screenPosition);

            // Let's tranform from screen to canvas then konva
            // TODO: isolate this in a function or hook
            invariant(dropRef.current);
            const canvasRect = (
              dropRef.current as HTMLDivElement
            ).getBoundingClientRect();
            const x = screenPosition.x - canvasRect.left;
            const y = screenPosition.y - canvasRect.top;

            const stage = stageRef.current;
            stage.setPointersPositions([screenPosition.x, screenPosition.y]);
            const pointerPosition = stage.getPointerPosition();
            if (pointerPosition) {
              const scaleX = stage.scaleX();
              const scaleY = stage.scaleY();
              const positionX = (x - stage.x()) / scaleX;
              const positionY = (y - stage.y()) / scaleY;

              // Not the right thing (we should add a new element)
              // but enough for the proof of concept
              // Update the position of the combobox
              setComboProps((comboProps) => ({
                ...comboProps,
                x: positionX,
                y: positionY,
              }));
            }
          }
        }
      },
    });
  }, []);

  // </Pragmatic drag and drop>

  // TODO: review fine tunning cursor and drop
  /*
    const handleZoom = (e: MouseEvent) => {
      const stage = stageRef.current;
      const scaleBy = 1.1;
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (!pointer) return;

      const mousePointTo = {
        x: pointer.x / oldScale - stage.x() / oldScale,
        y: pointer.y / oldScale - stage.y() / oldScale,
      };

      const newScale = e.currentTarget.id === 'zoom-in' ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: -(mousePointTo.x - pointer.x / newScale) * newScale,
        y: -(mousePointTo.y - pointer.y / newScale) * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    };
  */
  const onZoom = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    zoomIn: boolean
  ) => {
    const stage = stageRef.current;
    invariant(stage);
    const scaleBy = zoomIn ? 1.1 : 0.9;
    const oldScale = stage.scaleX();
    //const pointer = stage.getPointerPosition();

    const newScale = oldScale * scaleBy;
    stage.scale({ x: newScale, y: newScale });
    stage.batchDraw();
  };

  /* scroll*/
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      const stage = stageRef.current;
      invariant(stage);
      const scale = stage.scaleX();
      const dx = e.deltaX / scale;
      const dy = e.deltaY / scale;

      stage.position({
        x: stage.x() - dx,
        y: stage.y() - dy,
      });

      stage.batchDraw();
    };

    // dropRef is canvas ref, later on add another div for more clariy
    let container = null;
    if (dropRef.current) {
      container = dropRef.current as HTMLDivElement;
    }
    invariant(container);
    container?.addEventListener("wheel", handleScroll);

    return () => {
      container?.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <div style={{ container: "flex" }}>
      <button onClick={(e) => onZoom(e, true)}>Zoom in</button>
      <button onClick={(e) => onZoom(e, false)}>Zoom out</button>
      <div
        ref={dropRef}
        style={{ background: isDraggedOver ? "azure" : "white" }}
      >
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          ref={stageRef}
        >
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
              onTransform={handleTransformEnd}
              onTransformEnd={handleTransformEnd}
            />
            {widgetImageCollection.map((widget) =>
              convertImage(widget.imageUrl, widget.coord)
            )}
            
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.height > 51) {
                  newBox.height = 51;
                }
                if (newBox.width < 230) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default SvgLoader;
