import "./styles.css";
import { getAllCanvas } from "../../apicalls";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import CanvasCard from "../../components/CanvasCard/canvasCard";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/Spinner/spinner";

const AllCanvases = () => {
  const { token } = useContext(AuthContext);

  const {
    isLoading: allCanvasesLoading,
    data: allCanvases,
    refetch,
  } = useQuery({
    queryKey: ["AllCanvases", token],
    queryFn: getAllCanvas,
  });

  return (
    <div className="allCanvasesContainer">
      <h2>All Canvases</h2>

      <div className="cardsContainer">
        {allCanvasesLoading ? (
          <Spinner />
        ) : allCanvases?.length ? (
          allCanvases.map((e) => {
            return <CanvasCard data={e} />;
          })
        ) : (
          <h1>No Canvases Found</h1>
        )}
      </div>
    </div>
  );
};

export default AllCanvases;
