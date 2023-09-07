import "./styles.css";

import {
  faAngleLeft,
  faCloud,
  faDownload,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button1 from "../../components/Button1/button1";
import Button2 from "../../components/Button2/button2";
import Modal from "../../components/Modal/modal";

const CanvasLayout = ({
  id,
  children,
  handleDownload,
  handleSave,
  handleDelete,
  saveLoading,
  deleteLoading,
}) => {
  const [downloadModal, setDownloadModal] = useState(false);
  const ImageFormats = ["JPEG", "PNG", "WEBP", "PDF"];

  return (
    <div>
      <div className="header">
        <div className="subContainer">
          <Link to="/">
            <button className="homeButton">
              <FontAwesomeIcon icon={faAngleLeft} />
              <p>Home</p>
            </button>
          </Link>
        </div>

        <div className="subContainer">
          {id && (
            <Button2
              name={deleteLoading ? "Loading..." : "Delete"}
              func={() => {
                handleDelete();
              }}
              icon={faTrash}
            />
          )}

          <Button2
            name={"Download"}
            func={() => {
              setDownloadModal(true);
            }}
            icon={faDownload}
          />
          <Button1
            name={saveLoading ? "Loading..." : "Save"}
            func={() => {
              handleSave();
            }}
            icon={faCloud}
          />
        </div>
      </div>
      {children}

      <Modal modal={downloadModal} setModal={setDownloadModal}>
        <div className="downloadModal">
          <h3>Download</h3>
          <div className="buttonContainer">
            {ImageFormats.map((e) => {
              return (
                <Button1
                  name={e}
                  func={() => {
                    handleDownload(e);
                    setDownloadModal(false);
                  }}
                />
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CanvasLayout;
