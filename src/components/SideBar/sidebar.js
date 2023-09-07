import "./styles.css";

import {
  faChalkboard,
  faImage,
  faShapes,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useRef, useState } from "react";
import InputSlider from "react-input-slider";
import uuid from "react-uuid";
import Konva from "konva";
import Button1 from "../Button1/button1";
import Modal from "../Modal/modal";
import Button2 from "../Button2/button2";
import { getImages, getUserImages, postImages } from "../../apicalls";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Spinner/spinner";
import Searchbar from "../Searchbar/searchbar";

const TabIcon = ({ data, index, isSelected, isClicked }) => {
  return (
    <div
      className={`tabbtn ${isSelected ? "tabBtnSelected" : ""}`}
      onClick={() => {
        isClicked();
      }}
    >
      <FontAwesomeIcon
        icon={index === 0 ? faChalkboard : index === 1 ? faShapes : faImage}
      />
      <p>{data}</p>
    </div>
  );
};

const Sidebar = ({
  setCanvasSize,
  canvasSize,
  shapes,
  setShapes,
  images,
  setImages,
  dragUrl,
}) => {
  const { token } = useContext(AuthContext);
  const [selected, setSelected] = useState("");
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageSearchTerm, setImageSearchTerm] = useState("");

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      maxFiles: 1,
      accept: {
        "image/*": [".png", ".jpeg", ".jpg", ".webp"],
      },
    });

  const {
    isLoading: userImageListLoading,
    data: userImageList,
    refetch: userImageListRefetch,
  } = useQuery({
    queryKey: [`canvasimage${"1"}`, token],
    queryFn: getUserImages,
    enabled: !!token,
  });

  const { isLoading: imageListLoading, data: imageList } = useQuery({
    queryKey: [`images`],
    queryFn: getImages,
  });

  const TabIconList = ["Canvas", "Shapes", "Images"];
  const shapeList = [
    {
      name: "Rectangle",
      objName: "Rect",
      shapeProps: { width: 100, height: 100 },
    },
    {
      name: "Circle",
      objName: "Circle",
      shapeProps: { radius: 70 },
    },
    {
      name: "Ellipse",
      objName: "Ellipse",
      shapeProps: { radiusX: 100, radiusY: 50 },
    },
    {
      name: "Wedge",
      objName: "Wedge",
      shapeProps: { radius: 70, angle: 60 },
    },
    {
      name: "Star",
      objName: "Star",
      shapeProps: { rotation: 0, innerRadius: 20, outerRadius: 40 },
    },
    {
      name: "Ring",
      objName: "Ring",
      shapeProps: { rotation: 0, innerRadius: 20, outerRadius: 40 },
    },
  ];

  const HandleImageUpload = async () => {
    setImageUploadLoading(true);
    const res = await postImages(token, acceptedFiles[0], toast);
    setImageUploadLoading(false);

    if (res === "SUCCESS") setImageUploadLoading(false);
    userImageListRefetch();
  };

  return (
    <div className="sidebar">
      <div className="iconbar">
        {TabIconList.map((e, i) => {
          return (
            <TabIcon
              data={e}
              index={i}
              isSelected={selected === e}
              isClicked={() => {
                setSelected(e);
              }}
            />
          );
        })}
      </div>

      {selected ? (
        <div className="icondetailsbar">
          <div className="header">
            <button
              className="closeBtn"
              onClick={() => {
                setSelected("");
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className="mainContent">
            {selected === "Canvas" ? (
              <>
                <div>
                  <p>{`Width ${canvasSize.width} px`}</p>
                  <InputSlider
                    axis="x"
                    x={canvasSize.width}
                    onChange={({ x }) =>
                      setCanvasSize({ ...canvasSize, width: x })
                    }
                    xmax={3000}
                  />
                </div>

                <div>
                  <p>{`Height ${canvasSize.height} px`}</p>
                  <InputSlider
                    axis="x"
                    x={canvasSize.height}
                    onChange={({ x }) =>
                      setCanvasSize({ ...canvasSize, height: x })
                    }
                    xmax={3000}
                  />
                </div>
              </>
            ) : selected === "Shapes" ? (
              <div className="shapesContainer">
                {shapeList.map((e) => {
                  return (
                    <button
                      className="shapeBtn"
                      onClick={() => {
                        let temp = new Konva[e.objName]({
                          x: canvasSize.width / 2,
                          y: canvasSize.height / 2,
                          fill: "#4d52cc",
                          ...e.shapeProps,
                        });
                        setShapes({
                          ...shapes,
                          [e.objName]: [...shapes[e.objName], { ...temp }],
                        });
                      }}
                    >
                      {e.name}
                    </button>
                  );
                })}
              </div>
            ) : selected === "Images" ? (
              <div className="imageContainer">
                <Searchbar
                  searchterm={imageSearchTerm}
                  setSearchterm={setImageSearchTerm}
                  placeholder={"Search"}
                  type={"light"}
                />
                <div className="imageListContainer">
                  {imageSearchTerm ? (
                    <></>
                  ) : (
                    <>
                      {imageList?.map((e) => {
                        return (
                          <button
                            onClick={() => {
                              setImages([
                                ...images,
                                {
                                  x: 200,
                                  y: 200,
                                  id: uuid(),
                                  src: e.component_path,
                                },
                              ]);
                            }}
                          >
                            <img
                              alt="img"
                              src={e.component_path}
                              draggable="true"
                              onDragStart={(e) => {
                                dragUrl.current = e.target.src;
                              }}
                            />
                          </button>
                        );
                      })}

                      {userImageList?.map((e) => {
                        return (
                          <button
                            onClick={() => {
                              setImages([
                                ...images,
                                {
                                  x: 200,
                                  y: 200,
                                  id: uuid(),
                                  src: e.component_path,
                                },
                              ]);
                            }}
                          >
                            <img
                              alt="img"
                              src={e.component_path}
                              draggable="true"
                              onDragStart={(e) => {
                                dragUrl.current = e.target.src;
                              }}
                            />
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>

                {token && (
                  <div className="btnContainer">
                    <Button1
                      name="Upload Image"
                      func={() => {
                        setImageUploadModal(true);
                      }}
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <Modal modal={imageUploadModal} setModal={setImageUploadModal}>
        <div className="imageUploadModal">
          <h3>Upload Image</h3>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <div
              className={`dropzoneContent ${
                isDragActive ? "dropActive" : "dropInactive"
              }`}
            >
              {isDragActive ? (
                <p>Drop your Image here ...</p>
              ) : acceptedFiles.length && acceptedFiles[0] ? (
                <p>{acceptedFiles[0].path}</p>
              ) : (
                <p>Drag 'n' drop your Image, or click to select Image</p>
              )}
            </div>
          </div>

          <div className="btnContainer">
            <Button2
              name={imageUploadLoading ? "Loading..." : "Upload"}
              func={async () => {
                if (acceptedFiles.length) {
                  HandleImageUpload();
                } else {
                  toast("Select an image");
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
