import { Link } from "react-router-dom";
import "./styles.css";

const CanvasCard = ({ data }) => {
  return (
    <Link to={`/canvas?id=${data?.id}`}>
      <div className="canvasCardContainer">
        <div className="imageContainer"></div>
        <div className="canvasName">Canvas</div>
      </div>
    </Link>
  );
};

export default CanvasCard;
