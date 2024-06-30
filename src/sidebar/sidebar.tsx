import React, { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

const Sidebar: React.FC = () => {
  const dragRef = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = dragRef.current;
    // Add this to avoid typescript in strict mode complaining about null
    // on draggable({ element: el }); call
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ type: "combobox" }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  return (
    <div style={{ padding: "1rem", backgroundColor: "lightgrey" }}>
      <div
        ref={dragRef}
        style={{
          userSelect: "none",
          padding: "1rem",
          margin: "0 0 1rem 0",
          backgroundColor: "white",
        }}
      >
        <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="1"
            y="1"
            width="198"
            height="48"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1="160"
            y1="1"
            x2="160"
            y2="49"
            stroke="black"
            strokeWidth="2"
          />
          <polygon points="170,20 190,20 180,35" fill="black" />
          <text x="10" y="30" fontFamily="Arial" fontSize="20">
            Select an option
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Sidebar;
