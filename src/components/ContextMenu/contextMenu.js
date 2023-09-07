import "./styles.css";

const ContextMenu = ({ data, onClickEvent, setContextMenu }) => {
  return (
    <div
      className="contextContainer"
      onClick={() => {
        setContextMenu(false);
      }}
    >
      <div className="mainContent shadow">
        {data.map((e, index) => {
          return (
            <button
              onClick={() => {
                onClickEvent(index);
              }}
            >
              {e.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ContextMenu;
