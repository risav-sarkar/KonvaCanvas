import { useEffect, useRef, useState } from "react";
import {
  Rect,
  Circle,
  Ellipse,
  Wedge,
  Star,
  Ring,
  Transformer,
} from "react-konva";
import ContextMenu from "../ContextMenu/contextMenu";
import Portal from "../ContextMenu/portal";

const ContextData = [{ name: "Move Up" }, { name: "Move Down" }];

const Shape = ({ shapename, shapeProps, isSelected, onSelect, onChange }) => {
  const [contextMenu, setContextMenu] = useState(false);

  const ShapeName = shapename;
  const trRef = useRef();
  const shapeRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const HandleMoveUp = () => {
    shapeRef.current.moveUp();
  };

  const HandleMoveDown = () => {
    shapeRef.current.moveDown();
  };

  return (
    <>
      <ShapeName
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onContextMenu={(e) => {
          e.evt.preventDefault(true);
          setContextMenu(true);
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {contextMenu && (
        <Portal>
          <ContextMenu
            data={ContextData}
            onClickEvent={(index) => {
              if (index === 0) HandleMoveUp();
              else if (index === 1) HandleMoveDown();
            }}
            setContextMenu={setContextMenu}
          />
        </Portal>
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default Shape;
