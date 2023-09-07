import "./styles.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button2 = ({ name, func, icon }) => {
  return (
    <button
      className="button2 shadow"
      onClick={() => {
        func();
      }}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {name}
    </button>
  );
};

export default Button2;
