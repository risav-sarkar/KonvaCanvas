import "./styles.css";

import {
  faDownload,
  faPalette,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

const Topbar = ({
  selectedShapeName,
  selectedShapeIndex,
  selectedImageIndex,
  shapes,
  shapeColorSubmit,
  shapeDelete,
  imageDelete,
}) => {
  const [colorOpen, setColorOpen] = useState(false);
  let shapeList = shapes[selectedShapeName];

  useEffect(() => {
    if (!selectedShapeName && !selectedShapeIndex && !selectedImageIndex)
      setColorOpen(false);
  }, [shapes]);

  return (
    <div className="topbar">
      {selectedImageIndex !== null || selectedShapeIndex !== null ? (
        <>
          <button
            className="barBtn"
            onClick={() => {
              if (selectedShapeIndex !== null) shapeDelete();
              else imageDelete();
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
            <p>Delete</p>
          </button>
        </>
      ) : (
        <></>
      )}

      {selectedImageIndex !== null ? <></> : <></>}

      {selectedShapeIndex !== null ? (
        <>
          <button
            className="barBtn"
            onClick={() => {
              setColorOpen(!colorOpen);
            }}
          >
            <FontAwesomeIcon icon={faPalette} />
            <p>Select Color</p>
          </button>

          {colorOpen ? (
            <div className="colorPickerContainer">
              <HexColorPicker
                color={
                  shapeList ? shapeList[selectedShapeIndex]?.attrs.fill : null
                }
                onChange={(e) => {
                  shapeColorSubmit({
                    ...shapeList[selectedShapeIndex],
                    attrs: { ...shapeList[selectedShapeIndex].attrs, fill: e },
                  });
                }}
              />
            </div>
          ) : null}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Topbar;
