import "./styles.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button1 = ({ name, func, icon }) => {
  return (
    <button
      className="button1 shadow"
      onClick={() => {
        func();
      }}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {name}
    </button>
  );
};

export default Button1;
