import "./styles.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";

import Shape from "../../components/CanvasComponents/shape";
import Image from "../../components/CanvasComponents/image";
import uuid from "react-uuid";
import Sidebar from "../../components/SideBar/sidebar";
import Topbar from "../../components/TopBar/topbar";
import CanvasLayout from "../../layouts/CanvasLayout/canvasLayout";
import jsPDF from "jspdf";
import {
  deleteCanvas,
  getCanvas,
  patchCanvas,
  postCanvas,
} from "../../apicalls";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/Spinner/spinner";

const Canvas = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");

  const stageRef = useRef();
  const dragUrl = useRef();
  const globalRef = useRef();

  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [shapes, setShapes] = useState({
    Rect: [],
    Circle: [],
    Ellipse: [],
    Wedge: [],
    Star: [],
    Ring: [],
  });
  const [images, setImages] = useState([]);

  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedShapeName, setSelectedShapeName] = useState(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const { isLoading: canvasLoading, data: canvas } = useQuery({
    queryKey: [`canvas${id}`, token, id],
    queryFn: getCanvas,
    enabled: id ? true : false,
  });

  const CheckDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedShape(null);
      setSelectedShapeName(null);
      setSelectedShapeIndex(null);

      setSelectedImage(null);
      setSelectedImageIndex(null);
    }
  };

  const DropImage = (e) => {
    e.preventDefault();
    stageRef.current.setPointersPositions(e);
    setImages([
      ...images,
      {
        ...stageRef.current.getPointerPosition(),
        src: dragUrl.current,
        id: uuid(),
      },
    ]);
  };

  const HandleCanvasSave = async () => {
    setSaveLoading(true);
    if (id) {
      const res = await patchCanvas(
        token,
        id,
        { shapes, images },
        setSaveLoading,
        toast
      );
    } else {
      const res = await postCanvas(
        token,
        { shapes, images },
        setSaveLoading,
        toast
      );
    }
  };

  const HandleCanvasDelete = async () => {
    const res = await deleteCanvas(
      token,
      id,
      setDeleteLoading,
      toast,
      navigate
    );
  };

  const HandleCanvasDownload = (fileType) => {
    if (fileType === "PDF") {
      var pdf = new jsPDF("l", "px", [
        stageRef.current.width(),
        stageRef.current.height(),
      ]);
      pdf.setTextColor("#000000");
      // first add texts
      stageRef.current.find("Text").forEach((text) => {
        const size = text.fontSize() / 0.75; // convert pixels to points
        pdf.setFontSize(size);
        pdf.text(text.text(), text.x(), text.y(), {
          baseline: "top",
          angle: -text.getAbsoluteRotation(),
        });
      });

      // then put image on top of texts (so texts are not visible)
      pdf.addImage(
        stageRef.current.toDataURL({ pixelRatio: 2 }),
        0,
        0,
        stageRef.current.width(),
        stageRef.current.height()
      );

      pdf.save("canvas.pdf");
    } else {
      const uri = stageRef.current.toDataURL({
        mimeType: `image/${fileType}`,
        quality: 1,
      });

      let name = "canvas";
      let link = document.createElement("a");
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const HandleShapeDelete = () => {
    const arr = shapes[selectedShapeName].filter(
      (e) => e.id !== selectedShape.id
    );

    setShapes({
      ...shapes,
      [selectedShapeName]: [...arr],
    });
    setSelectedShape(null);
    setSelectedShapeName(null);
    setSelectedShapeIndex(null);
  };

  const HandleImageDelete = () => {
    let temp = [...images];
    temp.splice(0, 1);

    setImages([...temp]);
    setSelectedImage(null);
    setSelectedImageIndex(null);
  };

  useEffect(() => {
    if (canvas) {
      const temp1 = canvas.json_data.shapes;
      const temp2 = canvas.json_data.images;
      setShapes({ ...temp1 });
      setImages([...temp2]);
    }
  }, [canvas]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete") {
        if (selectedImageIndex !== null) {
          console.log("Image Del");
          HandleImageDelete();
        }
        if (selectedShapeIndex !== null) {
          console.log("Shape Del");
          HandleShapeDelete();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedShape, selectedImage]);

  if (canvasLoading && id) return <Spinner />;

  return (
    <CanvasLayout
      id={id}
      handleDownload={(fileType) => {
        HandleCanvasDownload(fileType);
      }}
      handleSave={() => {
        HandleCanvasSave();
      }}
      handleDelete={() => {
        HandleCanvasDelete();
      }}
      saveLoading={saveLoading}
      deleteLoading={deleteLoading}
    >
      <div className="canvasContainer">
        <Sidebar
          setCanvasSize={setCanvasSize}
          canvasSize={canvasSize}
          shapes={shapes}
          setShapes={setShapes}
          images={images}
          setImages={setImages}
          dragUrl={dragUrl}
        />

        <div className="drawingArea">
          <Topbar
            selectedShapeName={selectedShapeName}
            selectedShapeIndex={selectedShapeIndex}
            selectedImageIndex={selectedImageIndex}
            shapes={shapes}
            globalRef={globalRef}
            shapeColorSubmit={(e) => {
              const shape = shapes[selectedShapeName]?.slice();
              shape[selectedShapeIndex] = e;
              setShapes({
                ...shapes,
                [selectedShapeName]: [...shape],
              });
            }}
            shapeDelete={() => {
              HandleShapeDelete();
            }}
            imageDelete={() => {
              HandleImageDelete();
            }}
          />

          <div
            className="canvas shadow"
            style={{ height: canvasSize.height, width: canvasSize.width }}
            onDrop={(e) => {
              DropImage(e);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Stage
              width={canvasSize.width}
              height={canvasSize.height}
              onMouseDown={CheckDeselect}
              onTouchStart={CheckDeselect}
              ref={stageRef}
            >
              <Layer>
                {Object.keys(shapes).map((e) => {
                  return shapes[e].map((item, i) => {
                    return (
                      <Shape
                        shapename={e}
                        key={i}
                        shapeProps={item.attrs}
                        isSelected={item._id === selectedShape?._id}
                        onSelect={() => {
                          if (selectedImage) {
                            setSelectedImage(null);
                            setSelectedImageIndex(null);
                          }

                          setSelectedShape(item);
                          setSelectedShapeName(e);
                          setSelectedShapeIndex(i);
                        }}
                        onChange={(newAttrs) => {
                          const shape = shapes[e].slice();
                          shape[i].attrs = newAttrs;
                          setShapes({ ...shapes, [e]: [...shape] });
                        }}
                      />
                    );
                  });
                })}

                {images.map((e, index) => {
                  return (
                    <Image
                      imageProp={e}
                      isSelected={e.id === selectedImage?.id}
                      onSelect={() => {
                        if (selectedShape) {
                          setSelectedShape(null);
                          setSelectedShapeName(null);
                          setSelectedShapeIndex(null);
                        }
                        setSelectedImage(e);
                        setSelectedImageIndex(index);
                      }}
                      onChange={(newAttrs) => {
                        const image = images.slice();
                        image[index] = newAttrs;
                        setImages([...image]);
                      }}
                    />
                  );
                })}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </CanvasLayout>
  );
};

export default Canvas;
